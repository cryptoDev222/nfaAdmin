export const findAddressByType = (type, addresses) => {
	if (!addresses?.length) return null
	return addresses.find((address) => address.addressType.toLowerCase() === type.toLowerCase())
}

export const getAddressString = (type, addresses) => {
	const address = findAddressByType(type, addresses)

	if (!address) return null

	return [(address.street, address.postalCode, address.city)]
		.filter((v) => v !== undefined && v !== '')
		.join(', ')
}

export const getCountry = (type, addresses) => {
	const address = findAddressByType(type, addresses)

	if (!address) return null

	return address.country
}
