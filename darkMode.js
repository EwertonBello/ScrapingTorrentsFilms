let isDark = false;
let darkImg = './dark-mode-assets/moon.svg';
let sunImg = './dark-mode-assets/sun.svg';
let lightColor = '#FFFFFF';
let darkColor = '#202124';
let titleItem = document.querySelector('.title-via-js');

function loadDarkModeContent(img, backgroundColor){  
    let darkModeImg = document.querySelector('#dark-mode-img');
    
    darkModeImg.removeAttribute('src');
    darkModeImg.setAttribute('src', `${img}`);   
    document.querySelector("html").style.backgroundColor = `${backgroundColor}`;
}

function getDarkStatusFromLocalStorage(){
    isDark = localStorage.getItem('isDark');
    return isDark;
}

function startsTheme(){
    titleItem.style.fontSize = '30px';
    titleItem.style.marginBottom = '20px';
    
    isDark = getDarkStatusFromLocalStorage();
    if(isDark === 'true'){
        titleItem.style.color = '#F0F0F4';
        loadDarkModeContent(sunImg, darkColor);
    }
    else{
        titleItem.style.color = '#000000';
        loadDarkModeContent(darkImg, lightColor);
    }
}

function toggleDarkMode(){

    isDark = getDarkStatusFromLocalStorage();
    
    if(isDark === 'true'){
        isDark = false;
        localStorage.setItem('isDark', isDark);
        loadDarkModeContent(darkImg, lightColor);

        titleItem.style.color = '#000000';
    }
    else{
        isDark = true;
        localStorage.setItem('isDark', isDark);
        loadDarkModeContent(sunImg, darkColor);
        
        titleItem.style.color = '#F0F0F4';
    }
}