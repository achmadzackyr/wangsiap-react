export default function CommaValidation(n) {
  var sliced = '';
  if (n.slice(-1) == '.' || n.slice(-1) == ',') {
    sliced = n.slice(0, -1);
  } else {
    sliced = n;
    sliced = n.replace(/,/g, '.');
  }
  return sliced;
}
