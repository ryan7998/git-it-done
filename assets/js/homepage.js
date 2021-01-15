
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");

var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var languageButtonEl = document.querySelector("#language-buttons");


var getFeaturedRepos = function(language){
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "is:featured&sort=help-wanted-issues";
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                displayRepos(data.items, language);
            });
        }else{
            alert("Error: " + response.statusText);
        }
    });
};


var getUserRepos = function(user){
    // format the github api url:
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    
    // make request to the url:
    fetch(apiUrl)
    .then(function(response){
        // request was successfull
        if(response.ok){
            response.json()
            .then(function(data){
                displayRepos(data, user);
            });
        }else{
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        // Notice this '.catch getting chained on the end of the '.then()'
        alert("Unable to connect to Github");
    });
}

var displayRepos = function(repos, searchTerm){
    // check if api returned any repos
    if(repos.length === 0){
        repoContainerEl.textContent="No repositories found.";
        return;
    }
    repoContainerEl.textContent="";
    repoSearchTerm.textContent= searchTerm;

    // loop over repos
    for(var i=0; i<repos.length; i++){
        //format repo name
        var repoName = repos[i].owner.login + '/' + repos[i].name;
        
        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent=repoName;

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList="flex-row align-center";

        // check if current repo has issues or not
        if(repos[i].open_issues_count > 0){
            statusEl.innerHTML="<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }else{
            statusEl.innerHTML="<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(titleEl);
        repoEl.appendChild(statusEl);
        
        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

var formSubmitHanlder = function(event){
    event.preventDefault(); // prevents the browser from sending the form's input data to a URL
    
    // get value from input element:
    var username = nameInputEl.value.trim();
    if(username){
        getUserRepos(username);
        nameInputEl.value="";
    }else{
        alert("Please enter a GitHub username");
    }
}

var buttonClickHandler = function(event){
    var language = event.target.getAttribute("data-language");
    if(language){
        
        // clear old content
        repoContainerEl.textContent="";
        getFeaturedRepos(language);
    }
}


userFormEl.addEventListener("submit", formSubmitHanlder);
languageButtonEl.addEventListener("click", buttonClickHandler);