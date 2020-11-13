const searchInput = document.getElementById("search");
searchInput.addEventListener("change", function(e) {
    const currentValue  = e.target.value;

    const url = `https://api.github.com/search/repositories?q=${currentValue}&per_page=5&page=1`;
    fetch(url, {
        headers: {
            accept: "application/vnd.github.v3+json"
        }
    }).then (function(response) {
        if (response.ok) {
            return response.json();
        } else {
            alert("Не удалось обратиться к GitHub");
        }
    }).then (function(json) {
        const array = json.items;
        const autocomplete = document.getElementById("autocomplete");

        while(autocomplete.firstChild) {
            autocomplete.removeChild(autocomplete.lastChild);
        }

        for(let i = 0; i < array.length; i++) {
            const div = document.createElement("div");
            div.innerText = array[i].full_name;
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
                lineElement.innerText = `Name: ${array[i].full_name}`;
                leftElement.appendChild(lineElement);

                lineElement = document.createElement("div");
                lineElement.classList.add("line");
                lineElement.innerText = `Owner: ${array[i].owner.login}`;
                leftElement.appendChild(lineElement);

                lineElement = document.createElement("div");
                lineElement.classList.add("line");
                lineElement.innerText = `Stars: ${array[i].stargazers_count}`;
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

});

