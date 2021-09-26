import {longestCommonPrefix} from "./longest-common-prefix.js";

// init (date-) parameter values

document.querySelectorAll('[data-init-value]').forEach(inputField => {
    let date = new Date(Date.now())
    switch (inputField.dataset.initValue) {
        case 'yyyyMMdd-2b':  // the day before yesterday as yyyyMMdd; numerical
            if (date.getDay() < 3) {  // if Mon OR Tue, skip the weekend
                date.setTime(date.getTime() - 4 * 86_400_000) // 4 days in milliseconds
            } else {
                date.setTime(date.getTime() - 2 * 86_400_000) // 2 days in milliseconds
            }
            const yyyyMMdd = date.getFullYear().toString() + (date.getMonth() + 101).toString().substring(1, 3) + (date.getDate() + 100).toString().substring(1, 3)
            inputField.value = parseInt(yyyyMMdd, 10)
            return

        case '-2b': // minus 2 business days
            if (date.getDay() < 3) {  // if Mon OR Tue, skip the weekend
                inputField.value = 4
            } else {
                inputField.value = 2
            }
            return
    }
})

// collect parameters
const parameters = new Map() // param:string -> value:string
function updateParameter(paramField) {
    const param = paramField.dataset.parameter
    const value = paramField.value
    if (param === 'issueFilesGlob') {
        const issueFilesGlob = longestCommonPrefix(value.trim().split('\n'));
        console.log(param, ':=', issueFilesGlob)
        parameters.set(param, issueFilesGlob)
    } else {
        console.log(param, ':=', value)
        parameters.set(param, value)
    }
}

document.querySelectorAll('[data-parameter]').forEach(paramField => {
    // const param = paramField.dataset.parameter
    // const value = paramField.value
    // console.log('parameter', param, '=', value)
    // parameters.set(param, value)
    updateParameter(paramField)
    paramField.addEventListener('keyup', $event => {
        updateParameter($event.target);
        applyAllParameters()
    })
    paramField.addEventListener('change', $event => {
        updateParameter($event.target);
        applyAllParameters()
    })

})

// save recipe steps initial values, to base all changes on them
document.querySelectorAll('[data-recipe-step]').forEach(recipeStep => {
    recipeStep.dataset.initialValue = recipeStep.innerHTML
})

function applyAllParameters() {
    document.querySelectorAll('[data-recipe-step]').forEach(recipeStep => {
        recipeStep.innerHTML = recipeStep.dataset.initialValue
        parameters.forEach((val, key) => {
            const buffer = []
            if (val.includes(' ')) {
                buffer.push('"')
            }
            buffer.push('<span class="parameterized">')
            buffer.push(val)
            buffer.push('</span>')
            if (val.includes(' ')) {
                buffer.push('"')
            }

            recipeStep.innerHTML = recipeStep.innerHTML.replaceAll('${' + key + '}', buffer.join(''))
        })
    })
}

applyAllParameters()

const recipeStepClickHandler = (clickEvent) => {
    let text = clickEvent.currentTarget.innerText
    navigator.clipboard.writeText(text).then(
        () => {  // on textCopied
            console.log('text copied', text)
            const recipeList = clickEvent.target.closest('ul, ol')
            let recipeListItem = recipeList.firstElementChild
            let before = true, current = false, after = false
            while (recipeListItem) {
                if (recipeListItem.contains(clickEvent.target)) {
                    before = false
                    current = true
                } else if (!before) {
                    current = false
                    after = true
                }

                // recipeListItem.querySelector('input[type="checkbox"]').checked = (before || current)  // check curr and all before // uncheck all after
                const checkbox = recipeListItem.querySelector('input[type="checkbox"]');
                const recipeStep = recipeListItem.querySelector('[data-recipe-step]');
                if (current && checkbox) {
                    checkbox.checked = true
                }
                if (after && checkbox) {
                    checkbox.checked = false
                }
                if (recipeStep) {
                    recipeStep.classList.toggle('current', current)
                }

                recipeListItem = recipeListItem.nextElementSibling
            }
        },
        () => {
            console.error('Could not copy data to clipboard')  // ..., but the browser won't us tell why
        }
    );
}

document.querySelectorAll("[data-recipe-step]").forEach(recipeStep => {
    recipeStep.addEventListener('click', recipeStepClickHandler)
})
