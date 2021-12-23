class Bss {
	private classWrapper = 'bss-wrapper'
	private classItem = 'dropdown-item'
	private classItems = 'bss-items'
	private classClear = 'bss-clear'
	private classHeader = 'dropdown-header'
	private classHidden = 'd-none'
	private classNoResults = 'bss-no-results'
	private classTagRemove = 'bss-tag-remove'

	private target: HTMLSelectElement
	private search: Options['search']
	private create: Options['create']
	private clear: Options['clear']
	private maxHeight: Options['maxHeight']

	private dropdown: HTMLDivElement
	private dropdownToggle: HTMLButtonElement
	private searchInput: HTMLInputElement
	private clearBtn: HTMLButtonElement
	private noResults: HTMLDivElement

	private isMultiple: boolean
	private isDisabled: boolean

	constructor(selectElement: HTMLSelectElement, options?: Options) {
		this.target = selectElement
		this.search = options?.search ?? selectElement.dataset.bssSearch !== undefined
		this.create = options?.create ?? selectElement.dataset.bssCreate !== undefined
		this.clear = options?.clear ?? selectElement.dataset.bssClear !== undefined
		this.maxHeight = options?.maxHeight || selectElement.dataset.bssMaxHeight || '25rem'

		this.createDropdown()
		this.updateDropdown()
		this.registerEvents()
	}

	private createDropdown() {
		// delete if it already exists
		if (this.target.nextElementSibling
			&& this.target.nextElementSibling.classList
			&& this.target.nextElementSibling.classList.contains(this.classWrapper)) {
			this.target.nextElementSibling.remove()
		}

		const template = `
		<div class="dropdown ${this.classWrapper}">
			<button type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
			<div class="dropdown-menu" style="max-height:${this.maxHeight}">
				<div class="d-flex flex-column">
					<div class="bss-search-wrapper">
						<input type="text" class="form-control" placeholder="Search" onkeydown="return event.key !== 'Enter'">
					</div>
					<div class="${this.classItems}"></div>
					<div class="${this.classNoResults} ${this.classItem} text-wrap ${this.classHidden}">No results found</div>
				</div>
			</div>
			<button class="btn ${this.classClear}" tabindex="-1" type="button" title="Clear selection">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="none">
					<path d="M13 1L0.999999 13" stroke-width="2" stroke="currentColor"></path>
					<path d="M1 1L13 13" stroke-width="2" stroke="currentColor"></path>
				</svg>
			</button>
		</div>
		`
		// insert after target element
		this.target.insertAdjacentHTML('afterend', template)
		this.target.style.display = 'none'

		const dropdown = this.target.nextElementSibling

		// set properties
		if (dropdown instanceof HTMLDivElement) this.dropdown = dropdown
		this.dropdownToggle = dropdown.querySelector('[data-bs-toggle="dropdown"]')
		this.searchInput = dropdown.querySelector('input')
		this.clearBtn = dropdown.querySelector(`.${this.classClear}`)
		this.isMultiple = this.target.multiple
		this.isDisabled = this.target.disabled
		this.noResults = dropdown.querySelector(`.${this.classNoResults}`)

		// adjust
		this.dropdownToggle.className = this.target.className
		this.dropdownToggle.disabled = this.isDisabled
		this.target.classList.contains('form-select-sm') && this.searchInput.classList.add('form-control-sm')
		this.target.classList.contains('form-select-lg') && this.searchInput.classList.add('form-control-lg')
		if (!this.clear || this.isMultiple || !this.hasPlaceholder()) this.clearBtn.remove()
		if (!this.search) {
			this.searchInput.parentElement.remove()
			this.noResults.remove()
		}
	}

	private updateDropdown() {
		this.dropdownToggle.innerHTML = this.dropdownToggleInner()

		const items = this.dropdown.querySelector(`.${this.classItems}`)
		items.innerHTML = ''
		this.itemsInner().forEach((i) => items.appendChild(i))

		if (!this.isMultiple && this.target.value !== '' && this.hasPlaceholder()) {
			this.dropdownToggle.setAttribute('data-show-clear', 'true')
		} else {
			this.dropdownToggle.removeAttribute('data-show-clear')
		}

		if (!this.isDisabled) {
			this.dropdown.querySelectorAll(`.${this.classTagRemove}`).forEach((i) => {
				i.addEventListener('click', () => {
					this.dropdownToggle.click()
					this.removeValue(i.getAttribute('data-bs-value'))
				})
			})
		}

		this.searchInput.value = ''
		this.search && this.noResults.classList.add(this.classHidden)
	}

	private registerEvents() {
		// focus on the active item
		this.dropdownToggle.addEventListener('shown.bs.dropdown', () => {
			const active = this.dropdown.querySelector(`.${this.classItem}.active`)
			if (active && active instanceof HTMLButtonElement) active.focus()
		})

		// search
		this.searchInput.addEventListener('keyup', (e) => {
			const value = this.searchInput.value.trim()
			const items = this.dropdown.querySelectorAll(`button.${this.classItem}`)
			let found = 0
			items.forEach((i) => {
				i.classList.add(this.classHidden)
				if (i.innerHTML.toLowerCase().indexOf(value.toLowerCase()) > -1) {
					i.classList.remove(this.classHidden)
					found++
				}
			})
			this.dropdown.querySelectorAll(`.${this.classHeader}`).forEach((i) => {
				i.querySelectorAll(`button:not(.${this.classHidden})`).length
				? i.classList.remove(this.classHidden)
				: i.classList.add(this.classHidden)
			})
			if (found) {
				this.noResults.classList.add(this.classHidden)
			} else {
				this.noResults.classList.remove(this.classHidden)
				// create
				if (this.create) {
					this.noResults.innerHTML = `Press Enter to add "<b>${value}</b>"`
					if (e.key === 'Enter') {
						let opt = document.createElement('option')
						opt.value = value
						opt.selected = true
						opt.textContent = value
						this.target.add(opt)
						this.dropdownToggle.click()
						this.change()
					}
				}
			}
		})

		// clear
		this.clearBtn.addEventListener('click', () => {
			Array.from(this.target.options).forEach((i) => i.selected = false)
			this.hasPlaceholder() && (this.target.value = '')
			this.change()
		})

		this.target.addEventListener('change', () => this.updateDropdown())
	}

	setValue(value: string) {
		this.setSelectedOption(value, true)
		value !== '' && this.setSelectedOption('', false)
		this.change()
	}

	removeValue(value: string) {
		this.setSelectedOption(value, false)
		this.change()
	}

	getValue() {
		return this.isMultiple
		? Array.from(this.target.selectedOptions).map((i) => i.value)
		: this.target.value
	}

	private setSelectedOption(value: string, selected: boolean) {
		Array.from(this.target.options).forEach((i) => (i.value === value) && (i.selected = selected))
	}

	private change() {
		this.target.dispatchEvent(new Event('change'))
	}

	private dropdownToggleInner() {
		const options = this.target.options
		let selected = Array.from(this.target.selectedOptions)
		if (selected.length < 1 && this.isMultiple && this.hasPlaceholder()) {
			selected.push(options[0])
		}

		return selected.map((i) => {
			return i.value === ''
			? this.placeholder(i.innerHTML)
			: (this.isMultiple ? this.tag(i) : i.innerHTML)
		}).join('')
	}

	private itemsInner() {
		let items = []
		this.target.querySelectorAll(':scope>*').forEach((opt) => {
			if (opt instanceof HTMLOptionElement) {
				opt.value !== '' && items.push(this.item(opt))
			}
			if (opt instanceof HTMLOptGroupElement) {
				let header = document.createElement('div')
				header.classList.add(this.classHeader)
				header.innerHTML = `<span>${opt.label}</span>`
				opt.querySelectorAll('option').forEach((i) => header.appendChild(this.item(i)))
				items.push(header)
			}
		})
		return items
	}

	private placeholder(value: string) {
		return `<span class="bss-placeholder">${value}</span>`
	}

	private tag(option: HTMLOptionElement) {
		return `<div class="bss-tag"><svg data-bs-value="${option.value}" class="${this.classTagRemove}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
		${option.innerHTML}</div>`
	}

	private item(option: HTMLOptionElement) {
		let button = document.createElement('button')
		button.type = 'button'
		button.disabled = (option.selected && this.isMultiple) || option.disabled
		button.innerHTML = option.innerHTML
		button.classList.add(this.classItem)
		option.selected && button.classList.add('active')
		button.addEventListener('click', () => this.setValue(option.value))
		return button
	}

	private hasPlaceholder() {
		return this.target.options.length && this.target.options[0].value === ''
	}
}

export default Bss

interface Options {
	search?: boolean
	create?: boolean
	clear?: boolean
	maxHeight?: string
}
