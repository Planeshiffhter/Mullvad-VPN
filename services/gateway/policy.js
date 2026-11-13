import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import ipaddr from 'ipaddr.js';

const globalV6 = ipaddr.parseCIDR('2000::/3');
const reservedV6 = ['2001::/23', '3fff::/20'].map(value => ipaddr.parseCIDR(value));

/** Conservative internet-only destination policy. Special-use ranges fail closed. */
export function isPublicAddress(value) {
  try {
    let address = ipaddr.parse(value);
    if (address.kind() === 'ipv6' && address.isIPv4MappedAddress()) address = address.toIPv4Address();
    if (address.kind() === 'ipv6' && (!address.match(globalV6) || reservedV6.some(cidr => address.match(cidr)))) return false;
    return address.range() === 'unicast';
  } catch { return false; }
}

export function createDestinationPolicy({ resolve = lookup } = {}) {
  return async function destination(hostname, port, isHttp) {
    if (!Number.isInteger(port) || !(isHttp ? port === 80 : port === 443)) {
      throw new Error('Destination port denied');
    }
    const host = hostname.replace(/^\[|\]$/g, '');
    if (!host || host.includes('%')) throw new Error('Destination denied');
    const records = isIP(host)
      ? [{ address: host, family: isIP(host) }]
      : await resolve(host, { all: true, verbatim: true });
    if (!records.length || records.some(({ address }) => !isPublicAddress(address))) {
      throw new Error('Destination address denied');
    }
    // The forwarding library receives a lookup returning only this checked answer.
    // It cannot perform a second DNS lookup and follow a rebound/private answer.
    return records[0];
  };
}
