//require
const fs = require('fs');
const youtubedl = require('youtube-dl');


//dom
const url = document.querySelector('.url');
const path = document.querySelector('.path');
const button = document.querySelector('.btn');
const status = document.querySelector('.status');
const title = document.querySelector('.title');
const select = document.querySelector('.format');
const parsent = document.querySelector('.persent');

//local
const  PATH_LS = 'toPath';
const  URL_LS = 'toUrl';

const loadedToPath = localStorage.getItem(PATH_LS);
const loadedToUrl = localStorage.getItem(URL_LS);


//변수
let downloaded = 0;
let infoSize = 0;

let ITV = '';

// window.addEventListener('error',()=>{
    
//     status = '';

//     alert('error');

//     window.location.reload();


// })


document.addEventListener('DOMContentLoaded',()=>{
    
    if(loadedToPath !== null){
        path.value = JSON.parse(loadedToPath);
    }

})


function download(url,path,title,format){

    const options = ['--username=user', '--password=hunter2']

    youtubedl.getInfo(url, options, function(err, info) {
        if (err){
            alert('잘못된링크입니다.');
            status.textContent = '';
            url.value = '';
            return;
        }
      })


    const video = youtubedl(url,
    // Optional arguments passed to youtube-dl.
    [format.value],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname }
    )

    
    
    // Will be called when the download starts.
    video.on('info', function(info) {
        
        status.innerHTML = `다운로드중입니다. 프로그램을 종료하지마세요! </br>${info._filename}</br>`
        infoSize = info.size
        
        if (fs.existsSync(path+'/'+title+'.mp4')) {

            ITV = setInterval(()=>{
                
                downloaded = fs.statSync(path+'/'+title+'.mp4').size
                parsent.innerHTML = ((downloaded/infoSize)*100).toFixed(1)+'% 다운로드중'
                
            },500)
        }
    })
    
    video.on('end',()=>{
        
        status.innerHTML = `다운로드 완료되었습니다!`
        parsent.innerHTML = '';

        document.querySelector('.url').value ='';
        document.querySelector('.title').value = '';
        downloaded = 0;
        infoSize = 0;

        clearInterval(ITV);
        
    })
    

    video.pipe(fs.createWriteStream(path+'/'+title+'.mp4'))
    
    
}

path.addEventListener('change',(e)=>{
    
    localStorage.removeItem(PATH_LS);
    localStorage.setItem( PATH_LS, JSON.stringify(path.value));
    
    })

    url.addEventListener('change', (e)=>{
        localStorage.removeItem(URL_LS);
        localStorage.setItem(URL_LS,JSON.stringify(url.value));
    })
    
    button.addEventListener('click',(e)=>{
    
        e.preventDefault();
        
       if(url.value !== '' && path.value !== '' && title.value !== '' && select.options[select.selectedIndex].value !== ''){
        fs.stat(path.value, function(err) {
            if (!err) {

                    status.textContent = '..다운로드중..'
                   
                    download(url.value,path.value,title.value,select.options[select.selectedIndex])
                
                
            }
            else if (err.code === 'ENOENT') {
                
                status.textContent = '';
                path.value = '';

                alert('잘못된 경로입니다.')

                window.location.reload();
            }
        });
       }else {
           alert('주소 경로 제목을 정확히 입력해주세요')
           window.location.reload();
       }
           
    
        
    })
