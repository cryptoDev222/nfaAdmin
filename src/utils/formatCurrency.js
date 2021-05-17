const formatCurrency = (number) => {
	if (number) {
		number = parseInt(number.toString() + '000')
		return new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' }).format(number)
	} else {
		return ''
	}
}

export default formatCurrency
