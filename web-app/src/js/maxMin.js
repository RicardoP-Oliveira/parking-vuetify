export function dateFormatterOutput(data) {
  if (data) {
    const ndata = data.split('-');
    return (`${ndata[2]}/${ndata[1]}/${ndata[0]}`);
  }
}