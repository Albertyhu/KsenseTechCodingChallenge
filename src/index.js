import 'regenerator-runtime/runtime'
import './myStyle.css'
import PlusIconImg from './assets/white_plus_icon.png';

//for watching the html file 
require('./home.html')


var Users = [];
var Posts = []; 
var ProcessedData = []; 
const getUsers = async () => {
    await fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(json => {
            // FillTable(json);
            Users = json;
        })
        .then(() => { Posts = getPosts() })
        .catch(e => console.log("Error fetching users: " + e))
}

const getPosts = async () => {
    await fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(json => {
            Users.forEach(user => {
                var GatheredPosts = json.filter(post => post.userId === user.id)
                var UserData = {
                    id: user.id,
                    name: user.name, 
                    posts: GatheredPosts, 
                }
                ProcessedData.push(UserData)
            })
        })
        .then(() => { FillTable() }) 
        .catch(e => console.log("Error fetching posts: " + e))
}



//returns an array of the posts
const getPostsById = (id) => {
    return Posts.filter(post => post.userId === id); 
}

const RenderPosts = (userPost, ind, WrapperElem) => {
    const PostElem = document.createElement('div');

    const PostTitle = document.createElement('h3');
    PostTitle.innerHTML = userPost.title; 

    const PostPara = document.createElement('p'); 
    PostPara.innerHTML = userPost.body; 
    PostElem.appendChild(PostTitle);
    PostElem.appendChild(PostPara); 

    if (ind % 2 === 0) {
        PostElem.classList.add('whiteSection')
    }
    else {
        PostElem.classList.add('graySection')
    }

    WrapperElem.appendChild(PostElem);
}

const createUserSection = (user, TableElem) => {
    const UserSectionWrapper = document.createElement('div')
    UserSectionWrapper.classList.add('UserSectionWrapper')
    const UserSection = document.createElement('div')
    UserSection.classList.add('user_section')

    const NameElem = document.createElement('div'); 
    NameElem.innerHTML = user.name;
    NameElem.classList.add('name')
    UserSection.appendChild(NameElem); 

    const IconContainer = document.createElement('div')
    const Plus = document.createElement('img');
    Plus.src = PlusIconImg;  
    Plus.classList.add('icon'); 
    IconContainer.appendChild(Plus)

    UserSection.appendChild(NameElem);
    UserSection.appendChild(IconContainer); 

    UserSectionWrapper.appendChild(UserSection)
    TableElem.appendChild(UserSectionWrapper)

    var PostWrapper = document.createElement('div')
    PostWrapper.classList.add('PostWrapper'); 
    UserSectionWrapper.appendChild(PostWrapper)
    PostWrapper.classList.add('closed'); 

    user.posts.forEach((post, ind) => {
      //  RenderPosts(post, ind, UserSectionWrapper); 
        RenderPosts(post, ind, PostWrapper); 
    })

    UserSectionWrapper.addEventListener('click', ()=>togglePost(PostWrapper))
}

const togglePost = (PostElem) => {
    var OpenedPost = document.querySelector(".opened")
    if (OpenedPost !== null && OpenedPost !== PostElem) {
        OpenedPost.classList.remove('opened'); 
        OpenedPost.classList.add('closed')
    }
    if (PostElem.classList.contains('closed')) {
        PostElem.classList.remove('closed')
        PostElem.classList.add('opened')
    }
    else {
        PostElem.classList.remove('opened')
        PostElem.classList.add('closed')
    }
}

const FillTable = () => {
    const TableElem = document.querySelector('#UserTable'); 
    ProcessedData.forEach(user => {
        createUserSection(user, TableElem)
    }) 
} 

getUsers();

const ScrollButton = document.getElementById('scrollButton'); 
const ScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth',})
}

ScrollButton.addEventListener('mousedown', ScrollToTop)