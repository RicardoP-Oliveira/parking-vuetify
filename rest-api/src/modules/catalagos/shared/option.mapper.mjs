export const mapToOptions = (items, getText) => {
  return items.map(item => ({
    id: item.id,
    title: getText(item)
  }))
}