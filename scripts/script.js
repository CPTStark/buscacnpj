lucide.createIcons();

const input = document.getElementById('input-search-cnpj');
const button = document.getElementById('btn-search-cnpj');
const btnTheme = document.getElementById('theme');
const campYear = document.getElementById('year');
const data = new Date()
const year = data.getFullYear()
campYear.innerText = year
let isLoading = false

input.addEventListener('input', () => {
    let cnpj = input.value;

    cnpj = cnpj.replace(/\D/g, '');
    cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
    cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');

    input.value = cnpj;
})

button.addEventListener('click', searchCnpj);

btnTheme.addEventListener('click', toggleTheme);

function toggleTheme() {
    const body = document.body;

    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }

    updateThemeIcon();
}

function updateThemeIcon() {
    const body = document.body;
    if (body.classList.contains('dark-theme')) {
        btnTheme.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        `;
    } else {
        btnTheme.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
        `;
    }
}

function verifyDarkTheme() {
    const theme = localStorage.getItem('theme');

    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    updateThemeIcon();
}

document.addEventListener('DOMContentLoaded', verifyDarkTheme);

function toast(text, duration, gravity, position, background, color) {
    Toastify({
        text: text,
        duration: duration,
        close: true,
        gravity: gravity,
        position: position,
        stopOnFocus: true,
        style: {
          background: background,
          color: color, 
        },
        onClick: function(){}
      }).showToast();
}

function verifyIsLoading() {
    const loader = document.getElementById('loader');

    if (isLoading) {
        loader.classList.remove('disabled');
    } else {
        loader.classList.add('disabled');
    }
}

async function searchCnpj () {
    removeCard();

    const inputValue = input.value;
    if(inputValue.length < 18) {
        toast('Dígite um CNPJ válido', 3000, 'top', 'center', 'yellow', 'black');
        return
    }

    isLoading = true;
    verifyIsLoading();

    let cnpj = inputValue.replace(/[^\d]/g, '');

    try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);

        if(!response.ok) {
            toast(`HTTP Error: ${response.status}`, 3000, 'bottom', 'left', 'red', 'white');
            return
        }

        const data = await response.json();
        const dadosCNPJ = data;

        openBoxCnpj(dadosCNPJ);
        
    } catch(err) {
        toast(`Erro ao buscar o CNPJ: ${err}`, 3000, 'bottom', 'left', 'red', 'white');
    } finally {
        isLoading = false;
        verifyIsLoading();
    }
}

function openBoxCnpj(data) {
    const modalCard = document.getElementById('modal-card');

    const card = document.createElement('card');
    card.id = 'card';
    
    card.innerHTML = `
        <div class="divisor" id="first-divisor">
            <span>
                ${data.razao_social}
            </span>
        </div>
        <div class="divisor" id="secondary-divisor">
            <div id="cnpj" class="box-inf">
                <span>CNPJ</span>
                <p>${data.cnpj}</p>
            </div>
            <div id="register-situaation" class="box-inf">
                <span>Situação Cadastral</span>
                <p>${data.descricao_situacao_cadastral}</p>
            </div>
            <div id="uf" class="box-inf">
                <span>UF</span>
                <p>${data.uf}</p>
            </div>
            <button id='view-data-complete'>Visualizar dados completo</button>
        </div>
    `;

    modalCard.appendChild(card) ;

    const btnViewComplete = document.getElementById('view-data-complete')

    btnViewComplete.addEventListener('click', () => {
        openModalCnpj(data)
    });
}

function removeCard() {
    const exisitingCard = document.getElementById('card');
    if(exisitingCard) {
        exisitingCard.remove();
    }
}

function checkStatus(uf) {
    switch (uf) {
        case "AC":
            return "Acre";
        case "AL":
            return "Alagoas";
        case "AP":
            return "Amapá";
        case "AM":
            return "Amazonas";
        case "BA":
            return "Bahia";
        case "CE":
            return "Ceará";
        case "DF":
            return "Distrito Federal";
        case "ES":
            return "Espírito Santo";
        case "GO":
            return "Goiás";
        case "MA":
            return "Maranhão";
        case "MT":
            return "Mato Grosso";
        case "MS":
            return "Mato Grosso do Sul";
        case "MG":
            return "Minas Gerais";
        case "PA":
            return "Pará";
        case "PB":
            return "Paraíba";
        case "PR":
            return "Paraná";
        case "PE":
            return "Pernambuco";
        case "PI":
            return "Piauí";
        case "RJ":
            return "Rio de Janeiro";
        case "RN":
            return "Rio Grande do Norte";
        case "RS":
            return "Rio Grande do Sul";
        case "RO":
            return "Rondônia";
        case "RR":
            return "Roraima";
        case "SC":
            return "Santa Catarina";
        case "SP":
            return "São Paulo";
        case "SE":
            return "Sergipe";
        case "TO":
            return "Tocantins";
        default:
            return "Estado não encontrado";
    }
}

function openModalCnpj(data) {
    const container = document.getElementById('container');

    const containerModal = document.createElement('div')
    containerModal.classList.add('container-modal');
    
    containerModal.innerHTML = `
        <div id="modal-view-data-complete" class="modal-view">
            <div class="header-modal">
                <h2>Dados completos (CNPJ)</h2>
                <button class="btn-close-modal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
            <div class="main-modal">
                <div id="data-empresa" class="data-view">
                    <h3>Dados Empresariais</h3>
                    <div>
                        <span>CNPJ:</span>
                        <p>${data.cnpj}</p>
                    </div>
                    <div>
                        <span>Fantasia:</span>
                        <p>${data.nome_fantasia}</p>
                    </div>
                    <div>
                        <span>Razão Social:</span>
                        <p>${data.razao_social}</p>
                    </div>
                    <div>
                        <span>Nome responsável:</span>
                        <p>${data.qsa[0].nome_socio}</p>
                    </div>
                    <div>
                        <span>Telefone:</span>
                        <p>${data.ddd_telefone_1}</p>
                    </div>
                    <div>
                        <span>Porte:</span>
                        <p>${data.porte}</p>
                    </div>
                    <div>
                        <span>Situação Cadastral:</span>
                        <p>${data.descricao_situacao_cadastral}</p>
                    </div>
                    <div>
                        <span>Indetificador:</span>
                        <p>${data.descricao_identificador_matriz_filial}</p>
                    </div>
                </div>
                <div id="data-adress" class="data-view">
                    <h3>Endereço</h3>
                    <div>
                        <span>CEP:</span>
                        <p>${data.cep}</p>
                    </div>
                    <div>
                        <span>Estado</span>
                        <p>${checkStatus(data.uf)}</p>
                    </div>
                    <div>
                        <span>Munícipio</span>
                        <p>${data.municipio}</p>
                    </div>
                    <div>
                        <span>Bairro:</span>
                        <p>${data.bairro}</p>
                    </div>
                    <div>
                        <span>Logradouro:</span>
                        <p>${data.logradouro}</p>
                    </div>
                    <div>
                        <span>Número:</span>
                        <p>${data.numero}</p>
                    </div>
                </div>
            </div>
        </div>
    `
    container.appendChild(containerModal)

    const btnClose = document.querySelector('.btn-close-modal')

    window.addEventListener('click', (ev) => {
        if(ev.target.classList.contains('container-modal')) {
            containerModal.remove()
        }
    })

    btnClose.addEventListener('click', () => {
        containerModal.remove()
    })
}