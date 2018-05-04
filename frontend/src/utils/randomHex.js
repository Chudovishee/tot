export default function randomHex(len) {
  const buf = new Uint8Array(len);
  crypto.getRandomValues(buf);

  return Array.prototype.map.call(buf, num => num.toString(16))
    .join('');
}
