const words = [
    { english: 'a', meaning: 'a is a'},
    { english: 'b', meaning: 'b is b'},
    { english: 'c', meaning: 'c is c'},
    { english: 'd', meaning: 'd is d'},
    { english: 'e', meaning: 'e is e'},
    { english: 'arm', meaning: 'arm is arm'},
    { english: 'atm', meaning: 'atm is atm'},
    { english: 'army', meaning: 'army is army'},
    { english: 'antony', meaning: 'antony is antony'},
    { english: 'ant', meaning: 'ant is ant'},
    { english: 'boy', meaning: 'boy is boy'},
    { english: 'boom', meaning: 'boom is boom'},
    { english: 'bird', meaning: 'bird is bird'},
    { english: 'between', meaning: 'between is between'},
    { english: 'blut', meaning: 'blut is blut'},
    { english: 'blur', meaning: 'blur is blur'},
    { english: 'black', meaning: 'black is black'},
    { english: 'car', meaning: 'car is car'},
    { english: 'cat', meaning: 'cat is cat'},
    { english: 'camp', meaning: 'camp is camp'},
    { english: 'dump', meaning: 'dump is dump'},
    { english: 'door', meaning: 'door is door'},
    { english: 'doll', meaning: 'doll is doll'},
    { english: 'duck', meaning: 'duck is duck'},
    { english: 'drill', meaning: 'drill is drill'},
    { english: 'drive', meaning: 'drive is drive'},
    { english: 'drove', meaning: 'drove is drove'},
    { english: 'dirty', meaning: 'dirty is dirty'},
    { english: 'egg', meaning: 'egg is egg'}
];

const input = document.querySelector('#input');
const resultHeader = document.querySelector('.result-header');
const resultBody = document.querySelector('.result-body');
const resultContainer = document.querySelector('.result');
const filterSearchResult = document.querySelector('#search-result');
const lis = document.querySelectorAll('li');
const searchRecentElement = document.getElementById('search-recent');
const editButtonElement = document.getElementById('edit-button')
const acknowledgementElement = document.getElementById('acknowledgement');

const numberOfSearchResultDisplay = 5;
const errMessageTitle = 'No result found for your query';
const errMessageBody = 'Please check your spelling or try another term';
const errSearchMessage = 'No Suggestion Found!'
const RECENT = 'RECENT';
const SETTINGS = 'SETTINGS';
const ABOUT = 'ABOUT';
const IABIDAN = 'IABIDAN';

(function(){
    homePage();
})();

input.addEventListener('keypress', search);
input.addEventListener('input', filterSearch);


document.querySelector('body').addEventListener('click', () => {
    filterSearchResult.classList.add('hide');
});
document.querySelector('.logo').addEventListener('click', () => {
    if(window.matchMedia('(max-width: 450px').matches){
        hideAllElement();
    }
    homePage();
})

lis.forEach(li => {
    li.addEventListener('click', () => {
        if(li.innerHTML.toUpperCase() === RECENT){
            if(window.matchMedia('(max-width: 450px').matches){
                hideAllElement();
            }
            recentPage();
        }
        if(li.innerHTML.toUpperCase() === SETTINGS){
            if(window.matchMedia('(max-width: 450px').matches){
                hideAllElement();
            }
            settingsPage();
        }
        if(li.innerHTML.toUpperCase() === ABOUT){
            if(window.matchMedia('(max-width: 450px').matches){
                hideAllElement();
            }
            aboutPage();
        }
    })
});

acknowledgementElement.addEventListener('click', acknowledgementPage);

function acknowledgementPage(){
    resultContainer.classList.add('hide')
    document.querySelector('.about').classList.add('hide')
    document.querySelector('.setting').classList.add('hide');
    document.querySelector('.recent').classList.add('hide');
    document.querySelector('.acknowledgement').classList.remove('hide');
}

function homePage(){
    resultContainer.classList.add('hide')
    document.querySelector('.about').classList.add('hide')
    document.querySelector('.setting').classList.add('hide');
    document.querySelector('.recent').classList.add('hide');
    document.querySelector('.acknowledgement').classList.add('hide');
}

function recentPage(){
    resultContainer.classList.add('hide')
    document.querySelector('.recent').classList.remove('hide');
    document.querySelector('.setting').classList.add('hide');
    document.querySelector('.about').classList.add('hide');
    document.querySelector('.acknowledgement').classList.add('hide');
    appendToRecent();
}

function settingsPage(){
    resultContainer.classList.add('hide')
    document.querySelector('.recent').classList.add('hide');
    document.querySelector('.setting').classList.remove('hide');
    document.querySelector('.about').classList.add('hide')
    document.querySelector('.acknowledgement').classList.add('hide');
}

function aboutPage(){
    resultContainer.classList.add('hide')
    document.querySelector('.recent').classList.add('hide');
    document.querySelector('.setting').classList.add('hide');
    document.querySelector('.about').classList.remove('hide')
    document.querySelector('.acknowledgement').classList.add('hide');
}

function search(e){
    if(e.which === 13){
        homePage();
        recordSearch(input.value);
        filterSearchResult.classList.add('hide');
        resultContainer.classList.remove('hide')
        showTheResult(input.value);
    }
}

function recordSearch(recordValue){
    let data = getFromLocalDB();
    if(data === null){
        data = []
        data.push(recordValue);
        savetoLocalDB(data);
    }else{
        let ind = data.findIndex(d => d === recordValue)
        if(ind === -1){
            data.push(recordValue)
            savetoLocalDB(data);
        }
        
    }
}

function getFromLocalDB(){
    return JSON.parse(localStorage.getItem('dictionary'));
}

function savetoLocalDB(data){
    let obj = JSON.stringify(data);
    localStorage.setItem('dictionary', obj);
}

function filterSearch(){
    homePage();
    let arr = [];
    for(item of words){
        arr.push(item.english)
    }
    let sortedWord = arr.sort();
    filterSearchResult.classList.add('search');
    let inputResult = sortedWord.filter(word => word >= input.value);
    filterSearchResult.innerHTML = '';
    if(inputResult.length === 0) {
        filterSearchResult.classList.remove('hide')
        filterSearchResult.classList.add('err','title__err')
        filterSearchResult.innerHTML = errSearchMessage;
        return;
    }
    filterSearchResult.classList.remove('err')
    filterSearchResult.classList.remove('hide')
    let length = inputResult.length > numberOfSearchResultDisplay ? numberOfSearchResultDisplay : inputResult.length;
    for(let i = 0; i < length; i++){
        filterSearchResult.innerHTML += `<div class = "show-result" onclick = showResult('${inputResult[i]}')> ${inputResult[i]}</div>`;
    }
}

function showResult(searchValue){
    resultContainer.classList.remove('hide');
    input.value = searchValue;
    recordSearch(input.value)
    showTheResult(searchValue);
}

function showTheResult(value){
    let result = words.filter(word => word.english === value);
    if(result.length !== 0){
        resultHeader.innerHTML = '';
        resultBody.innerHTML = '';
        document.querySelector('hr').classList.remove('hide');
        resultContainer.classList.remove('result__err')
        resultHeader.classList.remove('title__err', 'err')
        resultBody.classList.remove('err')
        resultHeader.innerHTML = value;
        resultBody.innerHTML = result[0].meaning;
    }else{
        resultHeader.innerHTML = '';
        resultBody.innerHTML = '';
        document.querySelector('hr').classList.add('hide');
        resultContainer.classList.add('result__err')
        resultHeader.classList.add('title__err', 'err')
        resultBody.classList.add('err')
        resultHeader.innerHTML = errMessageTitle + ` '${value}'`
        resultBody.innerHTML = errMessageBody;
    }
}

//recent
function appendToRecent(){
    let data = getFromLocalDB();
    searchRecentElement.innerHTML = '';
    if(data === null){
        return;
    }
    for(item in data){
        searchRecentElement.innerHTML += `<div><input type="checkbox" class="recent-checkbox"><div id="recent-checkbox">${data[item]}</div></div><hr>`
    }
    editButtonElement.innerHTML = "";
    editButtonElement.innerHTML += `<button onclick = showDeleteBtn() class="edit">Edit</button>`;
}

function showDeleteBtn(){
    editButtonElement.innerHTML = '';
    editButtonElement.innerHTML += `<button class="edit">Edit</button>`;
    editButtonElement.innerHTML += `<button class = "delete" onclick = deleteRecent() >delete</button>`
    editButtonElement.innerHTML += `<button class = "delete" onclick = deleteAll()>deleteAll</button>`
}

function deleteAll(){
    localStorage.removeItem('dictionary');
    editButtonElement.innerHTML = "";
    appendToRecent();
}


//mobile responsive
const humburgerElement = document.querySelector('.humburger');
const overlayElement = document.querySelector('.overlay');
const drawerElement = document.querySelector('.drawer');

window.addEventListener('load', hideAllElement);
window.addEventListener('resize', showLiElement);

overlayElement.addEventListener('click', hideAllElement);
humburgerElement.addEventListener('click', showAllElement);

function showLiElement(){
    liElement();
}

function liElement(){
    lis.forEach(li => {
        if(window.matchMedia('(max-width: 450px').matches){
            li.classList.add('hide');
            return
        }
        li.classList.remove('hide');
    })
}

function hideAllElement(){
    overlayElement.classList.add('hide');
    drawerElement.classList.add('hide');
    document.querySelector('nav').classList.remove('mobile-nav');
    document.querySelector('.logo').classList.remove('mobile-logo');
    lis.forEach(li => {
        if(window.matchMedia('(max-width: 450px').matches){
            li.classList.add('hide');
            return
        }
        li.classList.remove('hide');
    })
}

function showAllElement(){
    overlayElement.classList.remove('hide');
    drawerElement.classList.remove('hide');
    lis.forEach(li => {
        li.classList.remove('hide');
    });
    document.querySelector('nav').classList.add('mobile-nav');
    document.querySelector('.logo').classList.add('mobile-logo');
}