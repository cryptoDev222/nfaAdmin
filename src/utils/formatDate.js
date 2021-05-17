const formatDate = (date, withTime = true) => {
	const format = 'en-GB'

	date = date + ' UTC'
	const d = new Date(date.replace(/-/g, '/'))

	if (withTime) {
		return d.toLocaleString(format)
	} else {
		return d.toLocaleDateString(format)
	}
}

export default formatDate
