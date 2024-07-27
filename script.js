/* script.js */
const users = JSON.parse(localStorage.getItem('users')) || [
    { username: 'veghmarcell', password: 'Sajt321234', name: 'Vegh Marcell', rank: 'Osztalyvezeto', phone: '1234567890', isAdmin: true }
];

const reports = JSON.parse(localStorage.getItem('reports')) || [];

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (user.isAdmin) {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'home.html';
        }
    } else {
        alert('Hibas felhasznalonev vagy jelszo');
    }
}

function showRegister() {
    const registrationHTML = `
        <div id="register-box">
            <h2>Regisztracio</h2>
            <input type="text" id="reg-name" placeholder="Nev">
            <input type="text" id="reg-phone" placeholder="Telefonszam">
            <input type="text" id="reg-rank" placeholder="Rendfokozat">
            <input type="text" id="reg-username" placeholder="Felhasznalonev">
            <input type="password" id="reg-password" placeholder="Jelszo">
            <button onclick="register()">Regisztracio</button>
            <button onclick="hideRegister()">Megse</button>
        </div>
    `;
    document.getElementById('login-container').innerHTML = registrationHTML;
}

function hideRegister() {
    location.reload();
}

function register() {
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const rank = document.getElementById('reg-rank').value;
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    if (name && phone && rank && username && password) {
        users.push({ username, password, name, rank, phone, isAdmin: false });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Sikeres regisztracio');
        hideRegister();
    } else {
        alert('Kerjuk, toltse ki az osszes mezot');
    }
}

function addReport() {
    const reportTitle = prompt('Adja meg a jelentés nevét');
    const reportAuthor = JSON.parse(localStorage.getItem('currentUser')).name;
    const reportContent = prompt('Irja be a jelentest');

    if (reportTitle && reportContent) {
        reports.push({ title: reportTitle, author: reportAuthor, content: reportContent });
        localStorage.setItem('reports', JSON.stringify(reports));
        alert('Jelentes elmentve');
        displayReports();
    } else {
        alert('Kerjuk, toltse ki az osszes mezot');
    }
}

function displayReports() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const reportsContainer = document.getElementById('reports-container');
    reportsContainer.innerHTML = '';

    reports.forEach((report, index) => {
        if (currentUser.isAdmin || report.author === currentUser.name) {
            const reportDiv = document.createElement('div');
            reportDiv.className = 'report';
            reportDiv.innerHTML = `
                <h3>${report.title}</h3>
                <p><strong>Jelentes iroja:</strong> ${report.author}</p>
                <p>${report.content}</p>
                <button onclick="editReport(${index})">Szerkesztes</button>
                <button onclick="deleteReport(${index})">Torles</button>
            `;
            reportsContainer.appendChild(reportDiv);
        }
    });
}

function editReport(index) {
    const reportContent = prompt('Irja be a jelentest', reports[index].content);
    if (reportContent) {
        reports[index].content = reportContent;
        localStorage.setItem('reports', JSON.stringify(reports));
        alert('Jelentes frissitve');
        displayReports();
    }
}

function deleteReport(index) {
    if (confirm('Biztos, hogy torolni szeretne ezt a jelentest?')) {
        reports.splice(index, 1);
        localStorage.setItem('reports', JSON.stringify(reports));
        alert('Jelentes torolve');
        displayReports();
    }
}

function displayUsers() {
    const usersContainer = document.getElementById('users-container');
    usersContainer.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user';
        userDiv.innerHTML = `
            <p><strong>Nev:</strong> ${user.name}</p>
            <p><strong>Fokozat:</strong> ${user.rank}</p>
            <p><strong>Telefonszam:</strong> ${user.phone}</p>
        `;
        usersContainer.appendChild(userDiv);
    });
}

function displayCurrentUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('profile-name').value = currentUser.name;
    document.getElementById('profile-phone').value = currentUser.phone;
    document.getElementById('profile-username').value = currentUser.username;
}

function updateProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const newName = document.getElementById('profile-name').value;
    const newPhone = document.getElementById('profile-phone').value;
    const newPassword = document.getElementById('profile-password').value;

    currentUser.name = newName;
    currentUser.phone = newPhone;
    if (newPassword) currentUser.password = newPassword;

    const userIndex = users.findIndex(u => u.username === currentUser.username);
    users[userIndex] = currentUser;

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('users', JSON.stringify(users));
    alert('Profil frissitve');
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('reports-container')) displayReports();
    if (document.getElementById('users-container')) displayUsers();
    if (document.getElementById('profile-name')) displayCurrentUserProfile();
});