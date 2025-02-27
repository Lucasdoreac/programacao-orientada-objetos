// Scripts para o site educativo sobre POO

document.addEventListener('DOMContentLoaded', function() {
    // Rolagem suave apenas para links internos (que começam com #)
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Só aplicamos o preventDefault() para links internos (com #)
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
            // Links externos ou de navegação funcionam normalmente
        });
    });

    // Funcionalidade de tabs
    document.querySelectorAll('.tab-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            // Tab buttons
            var tabId = this.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(function(btn) {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Tab contents
            document.querySelectorAll('.tab-content').forEach(function(content) {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Inicializar o Quiz
    initQuiz();
});

// Funções para modais
window.openModal = function(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden'; // Previne o scroll da página quando o modal está aberto
};

window.closeModal = function(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = ''; // Restaura o scroll da página
};

// Fechar modais ao clicar fora do conteúdo
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Código para os exemplos de código interativos
function runCode(exampleId) {
    const codeElement = document.querySelector(`#${exampleId} pre code`);
    const resultElement = document.querySelector(`#${exampleId}-result`);
    
    if (codeElement && resultElement) {
        try {
            // Limpa o resultado anterior
            resultElement.innerHTML = '';
            resultElement.classList.remove('error');
            
            // Obtém o código e executa
            const code = codeElement.textContent;
            
            // Substitui console.log por função que adiciona ao resultado
            const consoleLog = console.log;
            const outputs = [];
            
            console.log = function() {
                outputs.push(Array.from(arguments).map(arg => {
                    if (typeof arg === 'object') {
                        return JSON.stringify(arg, null, 2);
                    }
                    return arg;
                }).join(' '));
            };
            
            // Executa o código
            eval(code);
            
            // Restaura console.log
            console.log = consoleLog;
            
            // Mostra o resultado
            resultElement.innerHTML = outputs.join('<br>');
            resultElement.style.display = 'block';
            
        } catch (error) {
            resultElement.innerHTML = `<strong>Erro:</strong> ${error.message}`;
            resultElement.classList.add('error');
            resultElement.style.display = 'block';
        }
    }
}

// Inicializar o Quiz
function initQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;
    
    const questions = document.querySelectorAll('.quiz-question');
    const totalQuestions = questions.length;
    let currentQuestion = 1;
    const answers = {};
    
    // Mostrar apenas a primeira pergunta
    if (questions.length > 0) {
        questions[0].classList.add('active');
    }
    
    // Botão de próxima questão
    const nextButton = document.getElementById('next-question');
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            const radioButtons = document.querySelectorAll(`input[name="q${currentQuestion}"]`);
            let answered = false;
            
            radioButtons.forEach(function(radio) {
                if (radio.checked) {
                    answers[currentQuestion] = radio.value;
                    answered = true;
                }
            });
            
            if (!answered) {
                alert('Por favor, selecione uma resposta antes de continuar.');
                return;
            }
            
            if (currentQuestion < totalQuestions) {
                document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`).classList.remove('active');
                currentQuestion++;
                document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`).classList.add('active');
                
                // Atualizar botões de navegação
                document.getElementById('prev-question').disabled = false;
                
                if (currentQuestion === totalQuestions) {
                    nextButton.classList.add('hidden');
                    document.getElementById('submit-quiz').classList.remove('hidden');
                }
            }
        });
    }
    
    // Botão de questão anterior
    const prevButton = document.getElementById('prev-question');
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            if (currentQuestion > 1) {
                document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`).classList.remove('active');
                currentQuestion--;
                document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`).classList.add('active');
                
                // Atualizar botões de navegação
                prevButton.disabled = currentQuestion === 1;
                nextButton.classList.remove('hidden');
                document.getElementById('submit-quiz').classList.add('hidden');
            }
        });
    }
    
    // Botão de submeter quiz
    const submitButton = document.getElementById('submit-quiz');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            // Verificar se a última questão foi respondida
            const radioButtons = document.querySelectorAll(`input[name="q${currentQuestion}"]`);
            let answered = false;
            
            radioButtons.forEach(function(radio) {
                if (radio.checked) {
                    answers[currentQuestion] = radio.value;
                    answered = true;
                }
            });
            
            if (!answered) {
                alert('Por favor, selecione uma resposta para a última questão.');
                return;
            }
            
            // Respostas corretas - baseadas no questionário
            const correctAnswers = {
                1: 'd',  // Questão 1: Todas as alternativas
                2: 'b',  // Questão 2: Um modelo para criar objetos
                3: 'a',  // Questão 3: Uma instância de uma classe
                4: 'e',  // Questão 4: Decomposição funcional
                5: 'a',  // Questão 5: Ocultar os detalhes internos
                6: 'a',  // Questão 6: Herdar atributos e métodos de outra classe
                7: 'b',  // Questão 7: Um método ter múltiplas formas
                8: 'a',  // Questão 8: Criar uma classe Carro
                9: 'a',  // Questão 9: Uma requisição entre objetos
                10: 'c'  // Questão 10: Smalltalk
            };
            
            // Calcular pontuação
            let score = 0;
            for (let q in answers) {
                if (answers[q] === correctAnswers[q]) {
                    score++;
                }
            }
            
            // Mostrar resultado
            document.querySelector('.quiz-questions').classList.add('hidden');
            document.querySelector('.quiz-navigation').classList.add('hidden');
            document.getElementById('quiz-result').classList.remove('hidden');
            
            document.querySelector('.score-number').textContent = score;
            document.querySelector('.score-text').textContent = `de ${totalQuestions}`;
            
            // Mensagem baseada na pontuação
            const resultMessage = document.querySelector('.result-message');
            const percentage = (score / totalQuestions) * 100;
            
            if (percentage >= 90) {
                resultMessage.textContent = 'Excelente! Você domina os conceitos de POO!';
                resultMessage.style.color = '#2ecc71';
            } else if (percentage >= 70) {
                resultMessage.textContent = 'Muito bom! Você tem um bom entendimento de POO.';
                resultMessage.style.color = '#27ae60';
            } else if (percentage >= 50) {
                resultMessage.textContent = 'Bom trabalho! Continue estudando para melhorar.';
                resultMessage.style.color = '#f39c12';
            } else {
                resultMessage.textContent = 'Continue estudando! A POO tem conceitos fundamentais para dominar.';
                resultMessage.style.color = '#e74c3c';
            }
        });
    }
    
    // Botão de tentar novamente
    const retryButton = document.getElementById('retry-quiz');
    if (retryButton) {
        retryButton.addEventListener('click', function() {
            // Reiniciar o quiz
            currentQuestion = 1;
            
            // Limpar respostas
            for (let key in answers) {
                delete answers[key];
            }
            
            // Resetar todos os radio buttons
            document.querySelectorAll('input[type="radio"]').forEach(function(radio) {
                radio.checked = false;
            });
            
            // Esconder resultado
            document.getElementById('quiz-result').classList.add('hidden');
            
            // Mostrar perguntas e navegação
            document.querySelector('.quiz-questions').classList.remove('hidden');
            document.querySelector('.quiz-navigation').classList.remove('hidden');
            
            // Mostrar apenas a primeira pergunta
            document.querySelectorAll('.quiz-question').forEach(function(question) {
                question.classList.remove('active');
            });
            document.querySelector('.quiz-question[data-question="1"]').classList.add('active');
            
            // Resetar botões de navegação
            document.getElementById('prev-question').disabled = true;
            document.getElementById('next-question').classList.remove('hidden');
            document.getElementById('submit-quiz').classList.add('hidden');
        });
    }
}