const searchInput = document.getElementById("search");

function searchInputChange(e) {
    const currentValue  = e.target.value;
    if(!currentValue || currentValue.length === 0) {
        document.getElementById("autocomplete").classList.add("hidden");
        return;
    }
    const url = `https://api.github.com/search/repositories?q=${currentValue}&per_page=5&page=1`;
    fetch(url, {
        headers: {
            accept: "application/vnd.github.v3+json"
        }
    }).then (response => response.json()

    ).catch(err => alert(err.message + ':' + 'Не удалось обратиться к GitHub')

    ).then (function(json) {
        const repNames = json.items;
        const autocomplete = document.getElementById("autocomplete");

        while(autocomplete.firstChild) {
            autocomplete.removeChild(autocomplete.lastChild);
        }

        for(let i = 0; i < repNames.length; i++) {
            const div = document.createElement("div");
            div.innerText = repNames[i].full_name;
            div.classList.add("item");
            div.addEventListener("click", function() {
                const replist = document.getElementById("replist");

                const repositoryElement = document.createElement("div");
                repositoryElement.classList.add("repository");

                const leftElement = document.createElement("div");
                leftElement.classList.add("left");

                const rightElement = document.createElement("div");
                rightElement.classList.add("right");

                repositoryElement.appendChild(leftElement);
                repositoryElement.appendChild(rightElement);

                let lineElement = document.createElement("div");
                lineElement.classList.add("line");
                lineElement.innerText = `Name: ${repNames[i].full_name}`;
                leftElement.appendChild(lineElement);

                lineElement = document.createElement("div");
                lineElement.classList.add("line");
                lineElement.innerText = `Owner: ${repNames[i].owner.login}`;
                leftElement.appendChild(lineElement);

                lineElement = document.createElement("div");
                lineElement.classList.add("line");
                lineElement.innerText = `Stars: ${repNames[i].stargazers_count}`;
                leftElement.appendChild(lineElement);

                const removeLink = document.createElement("a");
                removeLink.classList.add("remove");
                removeLink.addEventListener("click", function(e) {
                    e.target.parentElement.parentElement.parentElement.remove();
                })

                const removeImage = document.createElement("img");
                removeImage.setAttribute("src", "images/cross.png");
                removeImage.setAttribute("alt", "Удалить репозиторий из списка");
                removeLink.appendChild(removeImage);
                rightElement.appendChild(removeLink);

                replist.appendChild(repositoryElement);

                autocomplete.classList.add("hidden");
                searchInput.value = "";
            });

            autocomplete.appendChild(div);
        }
        autocomplete.classList.remove("hidden");
    });

}

const debounce = (fn, debounceTime) => {
    let isBlocked = false;
    let timer;

    function debouncedFn() {
        const callback = () => {
            isBlocked = false;
            fn.apply(this, arguments);
        };

        if (!isBlocked) {
            isBlocked = true;
            timer = setTimeout(callback, debounceTime);
        } else {
            clearTimeout(timer);
            timer = setTimeout(callback, debounceTime);
        }
    }

    return debouncedFn;
};

searchInput.addEventListener("input", debounce(searchInputChange, 200));



