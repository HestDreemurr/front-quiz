// Retorna o QUIZ de um determinado tema
async function obterQuiz(tema) {
  let resposta = await fetch("./data.json")
  let data = await resposta.json()
  let quiz;
  
  data.quizes.forEach(assunto => {
    if (assunto.title == tema) {
      quiz = assunto
    }
  })
  
  return quiz
}


let temas = document.querySelectorAll("section.tema")

temas.forEach(tema => {
  tema.addEventListener("click", () => {
    let nomeDoTema = tema.querySelector("h3")
    obterQuiz(nomeDoTema.innerText)
      .then(perguntas => {
        prepararAmbiente(perguntas)
        prepararPerguntas()
        fazerPerguntas(perguntas.questions, 1, 0)
      })
    })
})


function prepararAmbiente(tema) {
  let subtitulo = document.querySelector("header > h2")
  
  let bgColor = tema.title.toLowerCase()
  
  subtitulo.classList.remove("lead")
  subtitulo.innerHTML = `<img src=${tema.icon} style="background-color: var(--bg-${bgColor})"> ${tema.title}`
  subtitulo.id = "titulo-tema"
  
  document.body.removeChild(document.querySelector("main"))
  document.body.removeChild(document.querySelector("footer"))
}

function prepararPerguntas() {
  let main = document.createElement("main")
  main.id = "quiz"
  
  let questoes = document.createElement("h6")
  questoes.id = "questoes"
  questoes.classList.add("text-muted")
  questoes.innerHTML = "Questão <span>0</span> de 10"
  
  let pergunta = document.createElement("h4")
  pergunta.id = "pergunta"
  pergunta.innerText = "pergunta..."
  
  let progress = document.createElement("div")
  progress.classList.add("progress")
  
  let progressBar = document.createElement("div")
  progressBar.classList.add("progress-bar")
  progress.appendChild(progressBar)
  
  let opcoes = document.createElement("section")
  opcoes.id = "opcoes"
  
  let letras = ["A", "B", "C", "D"]
  letras.forEach(letra => {
    let opcao = document.createElement("div")
    opcao.classList.add("opcao")
    
    opcao.innerHTML = `
    <div>
      <span id="letra">${letra}</span>
      <span class="resposta"></span>
    </div>
    `
    
    opcao.addEventListener("click", () => {
      document.querySelectorAll(".opcao").forEach(opc => {
        opc.classList.remove("selecionado")
      })
      
      opcao.classList.add("selecionado")
    })
    
    opcoes.appendChild(opcao)
  })
  
  let enviar = document.createElement("button")
  enviar.id = "enviar"
  enviar.classList.add("btn", "btn-block")
  enviar.innerText = "Enviar"
  
  main.appendChild(questoes)
  main.appendChild(pergunta)
  main.appendChild(progress)
  main.appendChild(opcoes)
  main.appendChild(enviar)
  
  document.body.appendChild(main)
}

function fazerPerguntas(perguntas, index, acertos) {
  if (index > 10) {
    finalizarQuiz(acertos)
    return
  }
  
  let pergunta = perguntas[index - 1]
  
  document.querySelector("#questoes > span").innerText = index
  
  let questao = document.querySelector("#pergunta")
  questao.innerText = pergunta.question
  
  let progressBar = document.querySelector(".progress-bar")
  progressBar.style.width = `${index * 10}%`
  
  let opcoes = document.querySelectorAll(".opcao")
  for (let i = 0; i < opcoes.length; i++) {
    let img = opcoes[i].querySelector("img")
    if (img) opcoes[i].removeChild(img)
    
    opcoes[i].classList.remove("correto")
    opcoes[i].classList.remove("errado")
    opcoes[i].classList.remove("selecionado")
    
    let resposta = opcoes[i].querySelector("span.resposta")
    resposta.innerText = pergunta.options[i]
  }
  
  let enviar = document.querySelector("button#enviar")
  enviar.addEventListener("click", () => {
    let erro = document.querySelector("p#erro")
    if (erro) document.querySelector("main").removeChild(erro)
    
    let resposta = document.querySelector(".selecionado  span.resposta")
    if (!resposta) {
      let erro = document.createElement("p")
      erro.id = "erro"
      erro.classList.add("text-danger", "mt-2")
      erro.style.textAlign = "center"
      erro.innerHTML = `<img src="./imagens/icon-incorrect.svg">`
      erro.innerHTML += "Selecione uma opção"
      
      document.querySelector("main").appendChild(erro)
      return
    }
    
    let escolhido = document.querySelector(".selecionado")
    let correto = getCorrect(pergunta)
    if (resposta.innerText == pergunta.answer) {
      acertos++
      escolhido.classList.remove("selecionado")
      escolhido.classList.add("correto")
      escolhido.innerHTML += `<img src="./imagens/icon-correct.svg">`
      botaoProximo(perguntas, index, acertos)
    } else {
      correto.classList.add("correto")
      correto.innerHTML += `<img src="./imagens/icon-correct.svg">`
      escolhido.classList.add("errado")
      escolhido.innerHTML += `<img src="./imagens/icon-incorrect.svg">`
      botaoProximo(perguntas, index, acertos)
    }
  })
}

function getCorrect(pergunta) {
  let correta;
  let opcoes = document.querySelectorAll(".opcao")
  opcoes.forEach(opcao => {
    let resposta = opcao.querySelector("span.resposta").innerText
    if (resposta == pergunta.answer) {
      correta = opcao
    }
  })
  return correta
}

function botaoProximo(perguntas, index, acertos) {
  let enviar = document.querySelector("button#enviar")
  enviar.style.display = "none"
  
  let proximo = document.createElement("button")
  proximo.classList.add("btn", "btn-block")
  proximo.innerText = "Próximo"
  proximo.addEventListener("click", () => {
    fazerPerguntas(perguntas, index + 1, acertos)
    proximo.style.display = "none"
    enviar.style.display = "block"
  })
  
  let main = document.querySelector("main")
  main.appendChild(proximo)
}

function finalizarQuiz(acertos) {
  let main = document.querySelector("main")
  main.innerHTML = ""
  
  let acertou = document.createElement("h2")
  acertou.innerText = "Voce acertou..."
  
  let section = document.createElement("section")
  section.id = "acertos"
  section.innerHTML = `
  <span>${acertos}</span>
  <p>De 10 questoes</p>
  `
  let novamente = document.createElement("button")
  novamente.classList.add("btn", "btn-block")
  novamente.innerText = "Jogar Novamente"
  novamente.addEventListener("click", () => {
    location.reload()
  })
  
  main.appendChild(acertou)
  main.appendChild(section)
  main.appendChild(novamente)
}