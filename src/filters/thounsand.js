export const ThousandSeparator = (input) => {
  return (
    input &&
    input
      .toString()
      .replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
  )
}
