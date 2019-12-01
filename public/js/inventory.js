

// Set maximum values for input boxes in inventory
for (let i = 1; i <= 8; i++) {
	let input = document.getElementById("stock" + i)
	let td = document.getElementById("td" + i)
	input.max = td.innerHTML
}