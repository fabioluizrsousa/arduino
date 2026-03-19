import React, { useState, useEffect } from "react";
import { 
  Cpu, Lock, CheckCircle, Star, Trophy, 
  ChevronRight, Play, RotateCcw, Zap, LockKeyhole, Award, Code2 
} from "lucide-react";

// ── CONFIGURAÇÕES E SONS ─────────────────────────────────────────────────────
const SENHA_MESTRE = "prof2026";
const audioSuccess = new Audio("https://cdn.pixabay.com/audio/2022/03/24/audio_34979e2c67.mp3");
const audioError = new Audio("https://cdn.pixabay.com/audio/2021/08/04/audio_0625624705.mp3");

const playSuccess = () => audioSuccess.play().catch(() => console.log("Áudio bloqueado"));
const playError = () => audioError.play().catch(() => console.log("Áudio bloqueado"));

// ── BANCO DE DADOS ARDUINO (30 FASES) ────────────────────────────────────────
const MODULOS = [
  {
    id: 0, sigla: "BASE", emoji: "🔌", titulo: "Arduino — Fundamentos C++",
    niveis: [
      { id:1, emoji:"💡", titulo:"Setup e Loop", cat:"Estrutura", xp:100, aula:{ intro:"Todo programa Arduino (sketch) tem duas funções vitais: setup() roda uma vez ao ligar, loop() roda para sempre.", blocos:[{t:"cod",c:"void setup() {\n  Serial.begin(9600);\n}"}] }, desafio:{ inst:"Complete o sketch iniciando a comunicação no setup com `Serial.begin(9600);`.", starter:"void setup() {\n  // Inicie a serial\n  \n}\n\nvoid loop() {\n}", dica:"Digite Serial.begin(9600); dentro das chaves do setup.", saida:"> (Comunicação Serial iniciada a 9600 baud)" }, validacao: [{ regex: /Serial\.begin\s*\(\s*9600\s*\)\s*;/i, erro: "Escreva Serial.begin(9600); com ponto e vírgula no final." }], explicacao: "A Serial permite que a placa converse com o computador." },
      { id:2, emoji:"🖨️", titulo:"Monitor Serial", cat:"Print", xp:100, aula:{ intro:"Para escrever no Monitor Serial, usamos Serial.println(). O 'ln' pula de linha no final.", blocos:[{t:"cod",c:"Serial.println(\"Ola!\");"}] }, desafio:{ inst:"Imprima \"Robotic\" no loop(). Lembre das aspas duplas e do ponto e vírgula!", starter:"void setup() {\n  Serial.begin(9600);\n}\nvoid loop() {\n  // Imprima Robotic\n  \n}", dica:"Serial.println(\"Robotic\");", saida:"Robotic\nRobotic\nRobotic\n..." }, validacao: [{ regex: /Serial\.println\s*\(\s*["']Robotic["']\s*\)\s*;/i, erro: "Escreva exatamente Serial.println(\"Robotic\");" }], explicacao: "Não esqueça: comandos em C++ quase sempre terminam com ;" },
      { id:3, emoji:"🔢", titulo:"Variáveis Inteiras", cat:"Dados", xp:150, aula:{ intro:"No C++, você deve avisar o tipo de dado que a variável vai guardar. 'int' guarda inteiros.", blocos:[{t:"cod",c:"int idade = 17;"}] }, desafio:{ inst:"Crie uma variável global `int pino = 13;` antes do setup().", starter:"// Declare a variável aqui\n\nvoid setup() {\n}\nvoid loop() {\n}", dica:"int pino = 13;", saida:"> (Variável 'pino' alocada na memória RAM do Arduino)" }, validacao: [{ regex: /int\s+pino\s*=\s*13\s*;/i, erro: "Crie a variável: int pino = 13;" }], explicacao: "Saber os tipos de dados evita estourar a memória da placa." },
      { id:4, emoji:"📏", titulo:"Números Quebrados", cat:"Dados", xp:150, aula:{ intro:"Para números com casas decimais, usamos o tipo 'float'. No C++, a vírgula é um ponto!", blocos:[{t:"cod",c:"float peso = 65.5;"}] }, desafio:{ inst:"Declare uma variável `float temperatura = 25.4;` e imprima ela no setup.", starter:"void setup() {\n  Serial.begin(9600);\n  // Declare e imprima\n  \n}\nvoid loop() {}", dica:"float temperatura = 25.4;\nSerial.println(temperatura);", saida:"25.4" }, validacao: [{ regex: /float\s+temperatura\s*=\s*25\.4\s*;/i, erro: "Faltou float temperatura = 25.4;" }, { regex: /Serial\.println\s*\(\s*temperatura\s*\)\s*;/i, erro: "Imprima a variável temperatura." }], explicacao: "Floats são cruciais para ler sensores com precisão." },
      { id:5, emoji:"🧮", titulo:"Matemática", cat:"Operações", xp:200, aula:{ intro:"Arduino é ótimo de cálculo. +, -, * (vezes) e / (divisão).", blocos:[{t:"cod",c:"int soma = a + b;"}] }, desafio:{ inst:"Crie `int dobro = 10 * 2;` e imprima o `dobro` no setup.", starter:"void setup() {\n  Serial.begin(9600);\n  \n}\nvoid loop() {}", dica:"int dobro = 10 * 2;\nSerial.println(dobro);", saida:"20" }, validacao: [{ regex: /int\s+dobro\s*=\s*10\s*\*\s*2\s*;/i, erro: "A variável dobro deve receber 10 * 2;" }, { regex: /Serial\.println\s*\(\s*dobro\s*\)\s*;/i, erro: "Não esqueça de imprimir a variável." }], explicacao: "Sempre faça contas em código em vez de colocar o número direto." },
      { id:6, emoji:"📌", titulo:"As Constantes", cat:"Dados", xp:200, aula:{ intro:"O #define cria um apelido para um valor que nunca muda. Não leva sinal de igual nem ponto e vírgula!", blocos:[{t:"cod",c:"#define LED 13"}] }, desafio:{ inst:"Crie um apelido `#define BOTAO 2` na primeira linha do código.", starter:"\nvoid setup() {}\nvoid loop() {}", dica:"#define BOTAO 2", saida:"> (Macro BOTAO definida pelo compilador)" }, validacao: [{ regex: /#define\s+BOTAO\s+2/i, erro: "Escreva #define BOTAO 2 exatamente assim." }, { regex: /#define\s+BOTAO\s+2\s*;/i, erro: "Erro Clássico: #define NÃO leva ponto e vírgula!" }], explicacao: "O compilador troca a palavra pelo número antes de gravar." },
      { id:7, emoji:"🔤", titulo:"Variáveis String", cat:"Texto", xp:250, aula:{ intro:"Para guardar palavras completas, usamos a classe String (com S maiúsculo!).", blocos:[{t:"cod",c:"String nome = \"Fabio\";"}] }, desafio:{ inst:"Crie `String aviso = \"Perigo\";` e imprima.", starter:"void setup() {\n  Serial.begin(9600);\n  // String aqui\n}\nvoid loop() {}", dica:"String aviso = \"Perigo\";\nSerial.println(aviso);", saida:"Perigo" }, validacao: [{ regex: /String\s+aviso\s*=\s*["']Perigo["']\s*;/i, erro: "Use String com S maiúsculo." }], explicacao: "Strings são pesadas para o Arduino Uno. Use com moderação." },
      { id:8, emoji:"🔗", titulo:"Concatenação", cat:"Texto", xp:250, aula:{ intro:"Você pode juntar textos e números usando o sinal de + no println.", blocos:[{t:"cod",c:"Serial.println(\"Valor: \" + String(5));"}] }, desafio:{ inst:"No println, imprima a junção de `\"XP: \"` e `100`.", starter:"void setup() {\n  Serial.begin(9600);\n  // Junte e imprima\n  \n}\nvoid loop() {}", dica:"Serial.println(\"XP: \" + String(100));", saida:"XP: 100" }, validacao: [{ regex: /Serial\.println\s*\(\s*["']XP:\s*["']\s*\+\s*String\s*\(\s*100\s*\)\s*\)\s*;/i, erro: "Junte com +, mas lembre de converter o 100 com String(100)." }], explicacao: "No C++, números precisam virar String antes de grudar num texto." },
      { id:9, emoji:"⏳", titulo:"Delay", cat:"Controle", xp:300, aula:{ intro:"delay(ms) pausa o processador. 1000ms equivalem a 1 segundo.", blocos:[{t:"cod",c:"delay(1000);"}] }, desafio:{ inst:"Faça o Arduino imprimir \"Oi\", esperar 2 segundos (2000ms), e depois imprimir \"Fim\".", starter:"void setup() {\n  Serial.begin(9600);\n}\nvoid loop() {\n  \n}", dica:"Serial.println(\"Oi\");\ndelay(2000);\nSerial.println(\"Fim\");", saida:"Oi\n(Pausa de 2s)\nFim" }, validacao: [{ regex: /Serial\.println\s*\(\s*["']Oi["']\s*\)\s*;\s*delay\s*\(\s*2000\s*\)\s*;\s*Serial\.println\s*\(\s*["']Fim["']\s*\)\s*;/is, erro: "Coloque o delay entre os dois prints." }], explicacao: "Enquanto está em delay(), o Arduino fica 'cego' para quase tudo." },
      { id:10, emoji:"🔥", titulo:"A Bateria", cat:"Boss 🔥", xp:400, aula:{ intro:"Chegou o desafio final do módulo! Organize constantes, variáveis e Serial.", blocos:[{t:"cod",c:"Revisão geral de C++."}] }, desafio:{ inst:"Defina `#define MAX 100`, crie `int atual = 50;` e imprima `\"Bateria: 50\"` no setup.", starter:"\nvoid setup() {\n  Serial.begin(9600);\n}\nvoid loop() {}", dica:"Use a concatenação para o print.", saida:"Bateria: 50" }, validacao: [{ regex: /#define\s+MAX\s+100/, erro: "Faltou definir a macro MAX." }, { regex: /int\s+atual\s*=\s*50\s*;/, erro: "Faltou a variável atual." }, { regex: /Serial\.println\s*\(\s*["']Bateria:\s*["']\s*\+\s*String\s*\(\s*atual\s*\)\s*\)\s*;/i, erro: "O print deve usar a variável atual." }], explicacao: "Sintaxe dominada! Agora vamos acender luzes!" }
    ]
  },
  {
    id: 1, sigla: "PORTAS", emoji: "🎛️", titulo: "Arduino — Pinos e Controle",
    niveis: [
      { id: 1, emoji: "🔌", titulo: "pinMode", cat: "Hardware", xp: 100, aula: { intro: "Antes de usar um pino, você DEVE dizer ao Arduino se ele vai enviar (OUTPUT) ou receber (INPUT) energia.", blocos: [{ t: "cod", c: "pinMode(13, OUTPUT);" }] }, desafio: { inst: "Configure o pino 8 como saída (OUTPUT) dentro do setup().", starter: "void setup() {\n  \n}\nvoid loop() {}", dica: "pinMode(8, OUTPUT);", saida: "> (Pino 8 configurado para enviar energia 5V)" }, validacao: [{ regex: /pinMode\s*\(\s*8\s*,\s*OUTPUT\s*\)\s*;/i, erro: "Lembre-se: OUTPUT é em maiúsculas." }], explicacao: "Sem o pinMode, o pino não terá força para ligar um LED." },
      { id: 2, emoji: "🔦", titulo: "digitalWrite", cat: "Hardware", xp: 100, aula: { intro: "Para mandar 5V para um pino, usamos HIGH. Para cortar a energia (0V), usamos LOW.", blocos: [{ t: "cod", c: "digitalWrite(13, HIGH);" }] }, desafio: { inst: "No loop(), ligue o pino 8 escrevendo `HIGH` nele.", starter: "void setup() {\n  pinMode(8, OUTPUT);\n}\nvoid loop() {\n  \n}", dica: "digitalWrite(8, HIGH);", saida: "> (Pino 8 ativado = 5V. LED aceso!)" }, validacao: [{ regex: /digitalWrite\s*\(\s*8\s*,\s*HIGH\s*\)\s*;/i, erro: "O comando é digitalWrite(pino, ESTADO);" }], explicacao: "Digital significa que só existem dois estados: Ligado ou Desligado." },
      { id: 3, emoji: "🚨", titulo: "Pisca-Pisca", cat: "Hardware", xp: 150, aula: { intro: "Juntando digitalWrite e delay, criamos o famoso efeito Blink.", blocos: [{ t: "cod", c: "digitalWrite(pino, HIGH);\ndelay(1000);" }] }, desafio: { inst: "No loop, ligue o pino 8, espere 500ms, desligue o pino 8, e espere 500ms.", starter: "void loop() {\n  // Ligar\n  \n  // Pausa\n  \n  // Desligar\n  \n  // Pausa\n  \n}", dica: "Use HIGH, depois delay, depois LOW, depois delay.", saida: "> LIGADO\n> (500ms)\n> DESLIGADO\n> (500ms)\n..." }, validacao: [{ regex: /digitalWrite\s*\(\s*8\s*,\s*HIGH\s*\)\s*;\s*delay\s*\(\s*500\s*\)\s*;\s*digitalWrite\s*\(\s*8\s*,\s*LOW\s*\)\s*;\s*delay\s*\(\s*500\s*\)\s*;/i, erro: "Verifique a ordem: Liga, Espera, Desliga, Espera." }], explicacao: "Parabéns, este é o 'Olá Mundo' da Eletrônica!" },
      { id: 4, emoji: "🔘", titulo: "digitalRead", cat: "Hardware", xp: 200, aula: { intro: "Para ler um botão, o pino deve ser INPUT. Depois usamos digitalRead para ver se entrou 5V (HIGH) ou 0V (LOW).", blocos: [{ t: "cod", c: "int estado = digitalRead(2);" }] }, desafio: { inst: "Configure o pino 2 como INPUT no setup e leia o estado dele para uma variável `int leitura` no loop.", starter: "void setup() {\n  \n}\nvoid loop() {\n  \n}", dica: "setup: pinMode(2, INPUT); \nloop: int leitura = digitalRead(2);", saida: "> (Leitura do pino 2 capturada para a variável)" }, validacao: [{ regex: /pinMode\s*\(\s*2\s*,\s*INPUT\s*\)\s*;/i, erro: "Faltou o pinMode(2, INPUT);" }, { regex: /int\s+leitura\s*=\s*digitalRead\s*\(\s*2\s*\)\s*;/i, erro: "Declare 'int leitura' recebendo o digitalRead(2)." }], explicacao: "Sempre capture o estado de um sensor em uma variável." },
      { id: 5, emoji: "🚦", titulo: "O Comando IF", cat: "Lógica", xp: 200, aula: { intro: "Se... Faça. O comando `if` verifica uma condição matemática.", blocos: [{ t: "cod", c: "if (leitura == HIGH) {\n  // faça algo\n}" }] }, desafio: { inst: "Se a variável `leitura` for igual a `HIGH`, ligue o LED do pino 8.", starter: "void loop() {\n  int leitura = digitalRead(2);\n  // Coloque o if aqui\n  \n}", dica: "if (leitura == HIGH) {\n  digitalWrite(8, HIGH);\n}", saida: "> (Botão pressionado -> LED ativado)" }, validacao: [{ regex: /if\s*\(\s*leitura\s*==\s*HIGH\s*\)\s*\{\s*digitalWrite\s*\(\s*8\s*,\s*HIGH\s*\)\s*;/i, erro: "Use == para comparar e as chaves {} para o bloco." }], explicacao: "Cuidado: if (a = b) atribui valor. if (a == b) COMPARA!" },
      { id: 6, emoji: "🔄", titulo: "Comando ELSE", cat: "Lógica", xp: 200, aula: { intro: "O `else` (senão) lida com o que acontece se a condição do if for falsa.", blocos: [{ t: "cod", c: "else {\n  // faça outra coisa\n}" }] }, desafio: { inst: "Adicione um `else` no código anterior para desligar o LED do pino 8 se o botão não estiver apertado.", starter: "void loop() {\n  if (leitura == HIGH) {\n    digitalWrite(8, HIGH);\n  }\n  // Adicione o else aqui\n}", dica: "else { digitalWrite(8, LOW); }", saida: "> (Botão solto -> LED desativado)" }, validacao: [{ regex: /else\s*\{\s*digitalWrite\s*\(\s*8\s*,\s*LOW\s*\)\s*;/i, erro: "O else deve conter o comando para LOW." }], explicacao: "Um sistema seguro sempre prevê as duas opções!" },
      { id: 7, emoji: "🌡️", titulo: "analogRead", cat: "Hardware", xp: 250, aula: { intro: "Sinais analógicos variam. A porta analógica do Arduino (A0, A1...) mede de 0 até 1023.", blocos: [{ t: "cod", c: "int valor = analogRead(A0);" }] }, desafio: { inst: "Leia o valor do pino `A0` na variável `int ldr` e imprima no Monitor Serial.", starter: "void loop() {\n  \n}", dica: "int ldr = analogRead(A0);\nSerial.println(ldr);", saida: "512\n514\n1023\n..." }, validacao: [{ regex: /int\s+ldr\s*=\s*analogRead\s*\(\s*A0\s*\)\s*;/i, erro: "Use analogRead(A0);" }, { regex: /Serial\.println\s*\(\s*ldr\s*\)\s*;/i, erro: "Não esqueça de imprimir." }], explicacao: "Ótimo para ler luminosidade (LDR) ou temperatura (NTC)." },
      { id: 8, emoji: "🌟", titulo: "PWM (analogWrite)", cat: "Hardware", xp: 250, aula: { intro: "Para variar o brilho de um LED ou a velocidade de um motor, usamos PWM nas portas com o símbolo ~.", blocos: [{ t: "cod", c: "analogWrite(9, 127); // 50%" }] }, desafio: { inst: "Envie um sinal PWM máximo (valor 255) para o pino 9 usando `analogWrite`.", starter: "void loop() {\n  \n}", dica: "analogWrite(9, 255);", saida: "> (Pino 9 emitindo PWM a 100% de ciclo de trabalho)" }, validacao: [{ regex: /analogWrite\s*\(\s*9\s*,\s*255\s*\)\s*;/i, erro: "Os valores do PWM vão de 0 a 255." }], explicacao: "O PWM liga e desliga o pino milhares de vezes por segundo." },
      { id: 9, emoji: "🗺️", titulo: "A Função map()", cat: "Lógica", xp: 300, aula: { intro: "A função map() converte uma escala de números em outra. Ex: Converter os 1023 do sensor para os 255 do LED.", blocos: [{ t: "cod", c: "int x = map(valor, 0, 1023, 0, 100);" }] }, desafio: { inst: "Crie `int luz = map(sensor, 0, 1023, 0, 255);`", starter: "void loop() {\n  int sensor = analogRead(A0);\n  // Faça o mapeamento\n  \n}", dica: "int luz = map(sensor, 0, 1023, 0, 255);", saida: "> (Mapeamento matemático concluído)" }, validacao: [{ regex: /int\s+luz\s*=\s*map\s*\(\s*sensor\s*,\s*0\s*,\s*1023\s*,\s*0\s*,\s*255\s*\)\s*;/i, erro: "Siga a ordem: variável, min_in, max_in, min_out, max_out." }], explicacao: "Isso economiza enormes dores de cabeça com Regra de 3!" },
      { id: 10, emoji: "🚨", titulo: "O Alarme", cat: "Boss 🔥", xp: 400, aula: { intro: "Juntando Entrada Analógica e Saída Digital!", blocos: [{ t: "cod", c: "Revisão geral do Módulo 2." }] }, desafio: { inst: "Leia `A0` na variável `gas`. Se `gas > 800`, ative o buzzer no pino `10` (HIGH). Senão, LOW no pino `10`.", starter: "void loop() {\n  \n}", dica: "Lembre de int gas = analogRead(A0); e a estrutura if/else.", saida: "> (Sistema de Segurança Monitorando: OK)" }, validacao: [{ regex: /int\s+gas\s*=\s*analogRead\s*\(\s*A0\s*\)\s*;/i, erro: "Leia o A0 para a variável gas." }, { regex: /if\s*\(\s*gas\s*>\s*800\s*\)\s*\{\s*digitalWrite\s*\(\s*10\s*,\s*HIGH\s*\)\s*;/i, erro: "If com condição correta faltando." }, { regex: /else\s*\{\s*digitalWrite\s*\(\s*10\s*,\s*LOW\s*\)\s*;/i, erro: "Faltou o else para desligar o buzzer." }], explicacao: "A base da automação residencial está na ponta dos seus dedos." }
    ]
  },
  {
    id: 2, sigla: "PRO", emoji: "🧠", titulo: "Arduino — Código Limpo",
    niveis: [
      { id: 1, emoji: "🔁", titulo: "Loop FOR", cat: "Repetição", xp: 100, aula: { intro: "O for é um contador automático. Ele cria uma variável, diz até onde ela vai, e como ela cresce.", blocos: [{ t: "cod", c: "for (int i = 0; i < 5; i++) {}" }] }, desafio: { inst: "Faça um loop for que comece em `1`, vá até `<= 5` e imprima a variável `i` no Monitor Serial.", starter: "void loop() {\n  \n}", dica: "for (int i = 1; i <= 5; i++) {\n  Serial.println(i);\n}", saida: "1\n2\n3\n4\n5" }, validacao: [{ regex: /for\s*\(\s*int\s+i\s*=\s*1\s*;\s*i\s*<=\s*5\s*;\s*i\+\+\s*\)\s*\{\s*Serial\.println\s*\(\s*i\s*\)\s*;/i, erro: "Cuidado com os pontos e vírgulas DENTRO dos parênteses do for." }], explicacao: "i++ é um atalho charmoso para escrever i = i + 1." },
      { id: 2, emoji: "✨", titulo: "Efeito Fade", cat: "Projetos", xp: 150, aula: { intro: "Juntando o `for` e o `analogWrite`, podemos acender um LED lentamente.", blocos: [{ t: "cod", c: "for (int i=0; i<255; i++) {\n  analogWrite(9, i);\n}" }] }, desafio: { inst: "Crie um loop for de 0 até `<= 255`. Dentro, aplique `analogWrite(9, i);` e dê um `delay(10);`.", starter: "void loop() {\n  \n}", dica: "Lembre-se de abrir e fechar as chaves do loop for corretamente.", saida: "> (Aumentando brilho gradativamente: 0% -> 100%)" }, validacao: [{ regex: /for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<=\s*255\s*;\s*i\+\+\s*\)\s*\{\s*analogWrite\s*\(\s*9\s*,\s*i\s*\)\s*;\s*delay\s*\(\s*10\s*\)\s*;/i, erro: "Estrutura do for ou comandos internos incorretos." }], explicacao: "Animações em hardware são feitas com pausas muito curtas!" },
      { id: 3, emoji: "📦", titulo: "Arrays (Vetores)", cat: "Dados", xp: 150, aula: { intro: "Arrays guardam vários valores em uma única variável, separados por vírgula. A contagem começa do ZERO.", blocos: [{ t: "cod", c: "int pinos[3] = {8, 9, 10};" }] }, desafio: { inst: "Declare um array global chamado `int notas[4] = {10, 8, 7, 9};` antes do setup.", starter: "// Crie o array aqui\n\nvoid setup() {\n}", dica: "A sintaxe exige as chaves {} e o ponto e vírgula no final.", saida: "> (Array de 4 posições alocado na memória)" }, validacao: [{ regex: /int\s+notas\s*\[\s*4\s*\]\s*=\s*\{\s*10\s*,\s*8\s*,\s*7\s*,\s*9\s*\}\s*;/i, erro: "Siga exatamente: int notas[4] = {10, 8, 7, 9};" }], explicacao: "Um array com [4] posições tem os índices 0, 1, 2 e 3." },
      { id: 4, emoji: "📍", titulo: "Acessando Arrays", cat: "Dados", xp: 200, aula: { intro: "Para ler um dado do array, colocamos o número da posição (índice) entre colchetes.", blocos: [{ t: "cod", c: "Serial.println(pinos[0]);" }] }, desafio: { inst: "O array já existe. Imprima o **terceiro** valor do array (que é o número 7). Lembre da regra do zero!", starter: "int notas[4] = {10, 8, 7, 9};\nvoid setup() {\n  // Imprima o número 7\n  \n}", dica: "Serial.println(notas[2]);", saida: "7" }, validacao: [{ regex: /Serial\.println\s*\(\s*notas\s*\[\s*2\s*\]\s*\)\s*;/i, erro: "O terceiro item está no índice 2!" }], explicacao: "Esquecer a regra do zero é o erro #1 de todo programador." },
      { id: 5, emoji: "🔄", titulo: "Arrays no For", cat: "Lógica", xp: 200, aula: { intro: "A mágica acontece quando usamos um `for` para passar por todo o Array de uma vez.", blocos: [{ t: "cod", c: "for(int i=0; i<3; i++) {\n  pinMode(pinos[i], OUTPUT);\n}" }] }, desafio: { inst: "Crie um `for` de 0 a `< 4` e imprima `notas[i]`.", starter: "int notas[4] = {10, 8, 7, 9};\nvoid setup() {\n  Serial.begin(9600);\n  \n}", dica: "for(int i=0; i<4; i++) {\n  Serial.println(notas[i]);\n}", saida: "10\n8\n7\n9" }, validacao: [{ regex: /for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*4\s*;\s*i\+\+\s*\)\s*\{\s*Serial\.println\s*\(\s*notas\s*\[\s*i\s*\]\s*\)\s*;/i, erro: "Itere com i indo de 0 até < 4." }], explicacao: "Assim configuramos dezenas de pinos com 3 linhas de código." },
      { id: 6, emoji: "⚙️", titulo: "Funções Void", cat: "Funções", xp: 250, aula: { intro: "Seu código está ficando bagunçado? Crie suas próprias funções! `void` significa que ela apenas executa, não devolve valor.", blocos: [{ t: "cod", c: "void bipar() {\n  // código\n}" }] }, desafio: { inst: "Crie uma função `void ligarMotor()` FORA do setup/loop, e coloque um `digitalWrite(5, HIGH);` dentro dela.", starter: "void loop() {\n}\n\n// Crie sua função aqui", dica: "Crie o bloco com as chaves {}", saida: "> (Função ligarMotor declarada com sucesso no escopo global)" }, validacao: [{ regex: /void\s+ligarMotor\s*\(\s*\)\s*\{\s*digitalWrite\s*\(\s*5\s*,\s*HIGH\s*\)\s*;/i, erro: "Crie void ligarMotor() e coloque o digitalWrite dentro." }], explicacao: "Funções ensinam 'novas palavras' para o Arduino." },
      { id: 7, emoji: "📞", titulo: "Chamando Funções", cat: "Funções", xp: 250, aula: { intro: "Criar a função não faz ela rodar. Você precisa 'invocá-la' no seu loop principal.", blocos: [{ t: "cod", c: "bipar();" }] }, desafio: { inst: "Chame a função `ligarMotor()` dentro do `loop()`.", starter: "void ligarMotor() {\n  digitalWrite(5, HIGH);\n}\nvoid loop() {\n  // Chame aqui\n  \n}", dica: "Apenas digite ligarMotor();", saida: "> (Motor Ligado via chamada de função externa)" }, validacao: [{ regex: /ligarMotor\s*\(\s*\)\s*;/i, erro: "Você invoca digitando o nome seguido de parênteses e ponto e vírgula." }], explicacao: "O código fica muito mais limpo e fácil de ler!" },
      { id: 8, emoji: "📥", titulo: "Parâmetros", cat: "Funções", xp: 300, aula: { intro: "Funções podem receber dados (argumentos) para se adaptarem. Colocamos as variáveis nos parênteses.", blocos: [{ t: "cod", c: "void piscar(int tempo) {\n  delay(tempo);\n}" }] }, desafio: { inst: "Crie uma função `void bip(int pino)` contendo um `digitalWrite(pino, HIGH);`.", starter: "// Crie a função com parâmetro aqui\n", dica: "void bip(int pino) {\n  digitalWrite(pino, HIGH);\n}", saida: "> (Função adaptável 'bip' carregada na memória)" }, validacao: [{ regex: /void\s+bip\s*\(\s*int\s+pino\s*\)\s*\{\s*digitalWrite\s*\(\s*pino\s*,\s*HIGH\s*\)\s*;/i, erro: "Passe int pino dentro dos parênteses da função." }], explicacao: "Assim a mesma função serve para qualquer pino da placa!" },
      { id: 9, emoji: "🤝", titulo: "Operador E (&&)", cat: "Lógica", xp: 300, aula: { intro: "Para checar duas coisas ao mesmo tempo no IF, usamos o E comercial duplo (&&).", blocos: [{ t: "cod", c: "if (botao1 == HIGH && botao2 == HIGH)" }] }, desafio: { inst: "Crie um if que cheque se `chave == 1` && `senha == 123` e imprima `\"Aberto\"`.", starter: "void loop() {\n  int chave = 1;\n  int senha = 123;\n  // Faça o if\n}", dica: "Use os dois sinais de == em cada comparação e o && no meio.", saida: "Aberto" }, validacao: [{ regex: /if\s*\(\s*chave\s*==\s*1\s*&&\s*senha\s*==\s*123\s*\)\s*\{\s*Serial\.println\s*\(\s*["']Aberto["']\s*\)\s*;/i, erro: "Estrutura do if com && incorreta." }], explicacao: "Máquinas industriais e prensas usam isso por segurança (2 botões)." },
      { id: 10, emoji: "🚦", titulo: "Engenheiro de Tráfego", cat: "Boss 🔥", xp: 500, aula: { intro: "Chegou o momento! Juntar Constantes, Funções e Delays.", blocos: [{ t: "cod", c: "O Grande Final do ArduinoLingo!" }] }, desafio: { inst: "Chame as funções prontas `verde()`, `amarelo()` e `vermelho()` no loop. Mas ATENÇÃO: coloque `delay(2000)` depois do verde e vermelho, e `delay(500)` depois do amarelo.", starter: "void loop() {\n  \n}", dica: "verde(); delay(2000); amarelo(); delay(500); vermelho(); delay(2000);", saida: "> VERDE ativado\n> (Pausa 2s)\n> AMARELO ativado\n> (Pausa 0.5s)\n> VERMELHO ativado\n> (Pausa 2s)" }, validacao: [{ regex: /verde\s*\(\s*\)\s*;\s*delay\s*\(\s*2000\s*\)\s*;\s*amarelo\s*\(\s*\)\s*;\s*delay\s*\(\s*500\s*\)\s*;\s*vermelho\s*\(\s*\)\s*;\s*delay\s*\(\s*2000\s*\)\s*;/i, erro: "A sequência e os tempos do semáforo precisam estar idênticos à instrução." }], explicacao: "Você dominou o C++ no Arduino! O mundo do hardware está em suas mãos." }
    ]
  }
];

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function ArduinoLingoPro() {
  const [nomeAluno, setNomeAluno] = useState(() => localStorage.getItem("ard_nome") || "");
  const [appIniciado, setAppIniciado] = useState(() => localStorage.getItem("ard_iniciado") === "true");
  const [finalizado, setFinalizado] = useState(() => localStorage.getItem("ard_finalizado") === "true");
  const [showModuleComplete, setShowModuleComplete] = useState(false);
  
  const [xp, setXp] = useState(() => Number(localStorage.getItem("ard_xp")) || 0);
  
  const [done, setDone] = useState(() => {
    try {
      const saved = localStorage.getItem("ard_done");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  
  const [unlockedMods, setUnlockedMods] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ard_unlocked")) || [0]; } 
    catch { return [0]; }
  });
  
  const [modIdx, setModIdx] = useState(() => Number(localStorage.getItem("ard_modIdx")) || 0);
  const [lvlIdx, setLvlIdx] = useState(() => Number(localStorage.getItem("ard_lvlIdx")) || 0);
  const [fase, setFase] = useState(() => localStorage.getItem("ard_fase") || "aula");
  
  const [userCode, setUserCode] = useState(() => {
    const savedCode = localStorage.getItem("ard_userCode");
    return savedCode !== null ? savedCode : MODULOS[0].niveis[0].desafio.starter;
  });

  const [feedback, setFeedback] = useState(null);
  const [showPassModal, setShowPassModal] = useState(null);
  const [passInput, setPassInput] = useState("");

  const mod = MODULOS[modIdx];
  const lvl = mod.niveis[lvlIdx];
  const totalConcluido = Object.keys(done).length;

  useEffect(() => {
    localStorage.setItem("ard_nome", nomeAluno);
    localStorage.setItem("ard_iniciado", appIniciado);
    localStorage.setItem("ard_finalizado", finalizado);
    localStorage.setItem("ard_xp", xp);
    localStorage.setItem("ard_done", JSON.stringify(done));
    localStorage.setItem("ard_unlocked", JSON.stringify(unlockedMods));
    localStorage.setItem("ard_modIdx", modIdx);
    localStorage.setItem("ard_lvlIdx", lvlIdx);
    localStorage.setItem("ard_fase", fase);
    localStorage.setItem("ard_userCode", userCode);
  }, [nomeAluno, appIniciado, finalizado, xp, done, unlockedMods, modIdx, lvlIdx, fase, userCode]);

  const tentarDesbloquear = () => {
    if (passInput === SENHA_MESTRE) {
      setUnlockedMods([...unlockedMods, showPassModal]);
      setModIdx(showPassModal);
      setLvlIdx(0);
      setUserCode(MODULOS[showPassModal].niveis[0].desafio.starter);
      setShowPassModal(null);
      setPassInput("");
      playSuccess();
    } else {
      playError();
      alert("Senha incorreta!");
    }
  };

  const analisarCodigo = () => {
    // Tratamento basico para ignorar enters perdidos
    const codeToTest = userCode.trim();
    
    for (const regra of lvl.validacao) {
      if (!regra.regex.test(codeToTest)) {
        setFeedback({ 
          tipo: "err", 
          msg: regra.erro, 
          emoji: "❌", 
          sysOut: `avrdude: stk500_recv(): compiler error\nC++ Syntax/Logic Error: ${regra.erro}` 
        });
        playError();
        return;
      }
    }
    const key = `${modIdx}-${lvlIdx}`;
    if (!done[key]) {
      setDone(prev => ({ ...prev, [key]: true }));
      setXp(prev => prev + lvl.xp);
    }
    playSuccess();
    setFeedback({ 
      tipo: "ok", 
      msg: "Sketch compilado e enviado com sucesso.", 
      emoji: "🚀", 
      sysOut: lvl.desafio.saida 
    });
  };

  const proximaFase = () => {
    if (modIdx === 2 && lvlIdx === mod.niveis.length - 1) {
      setFinalizado(true);
      return;
    }
    
    if (lvlIdx === mod.niveis.length - 1) {
      setShowModuleComplete(true);
      return;
    }

    const next = lvlIdx + 1;
    setLvlIdx(next);
    setUserCode(mod.niveis[next].desafio.starter);
    setFase("aula");
    setFeedback(null);
  };

  // 1. TELA DE INÍCIO
  if (!appIniciado) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-white font-sans" style={{ background: "#0a192f" }}>
        <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-md w-full text-center shadow-[0_0_40px_rgba(0,151,156,0.3)]">
          <Cpu className="w-20 h-20 text-cyan-500 mx-auto mb-6 drop-shadow-lg" />
          <h1 className="text-4xl font-black mb-2 italic">ArduinoLingo<span className="text-cyan-500">.</span></h1>
          <p className="text-cyan-200/60 mb-8 font-mono text-sm">O simulador lógico C++ da **CEEFMTI ASSISOLINA ASSIS ANDRADE**!</p>
          <input 
            type="text" placeholder="Seu nome completo..." 
            className="w-full bg-slate-950 border border-slate-700 p-4 rounded-2xl mb-4 text-center outline-none focus:border-cyan-500 transition-all text-cyan-400 font-bold tracking-wide"
            value={nomeAluno} onChange={(e) => setNomeAluno(e.target.value)}
          />
          <button 
            disabled={nomeAluno.length < 3} onClick={() => setAppIniciado(true)}
            className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-2xl font-black transition-all text-white tracking-widest uppercase shadow-lg shadow-cyan-900/50"
          >
            Ligar Placa 🔌
          </button>
        </div>
      </div>
    );
  }

  // 2. TELA DE CERTIFICADO
  if (finalizado) {
    return (
      <div className="min-h-screen bg-white text-slate-900 p-8 flex flex-col items-center justify-center font-sans">
        <div className="border-[12px] border-double border-slate-200 p-12 max-w-3xl w-full text-center relative">
          <div className="absolute top-6 right-6 flex flex-col items-center opacity-80 rotate-12">
            <div className="w-16 h-16 border-4 border-cyan-500 rounded-full flex items-center justify-center font-black text-cyan-600 text-[10px] text-center p-1 leading-tight">
              SELO MAYA DE QUALIDADE
            </div>
          </div>
          <h3 className="text-cyan-600 font-black uppercase tracking-[0.3em] mb-4 text-sm">Certificado de Conclusão</h3>
          <h1 className="text-5xl font-serif mb-8 italic">ArduinoLingo Pro</h1>
          <p className="text-xl mb-2 text-slate-500">Certificamos que</p>
          <h2 className="text-4xl font-black mb-8 underline decoration-cyan-500 underline-offset-8">{nomeAluno}</h2>
          <p className="max-w-md mx-auto leading-relaxed text-slate-600 mb-8 font-medium">
            Concluiu com êxito os 30 desafios de Eletrônica Programável e Lógica C++ na <strong>CEEFMTI ASSISOLINA ASSIS ANDRADE</strong>.
          </p>
          <div className="flex justify-between items-end mt-16 border-t pt-8 border-slate-100">
            <div className="text-left">
              <p className="text-xs uppercase text-slate-400 font-bold">XP TOTAL CONQUISTADO</p>
              <p className="font-mono text-xl font-bold text-cyan-600">{xp}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase text-slate-400 font-bold">Professor Titular</p>
              <p className="font-bold italic">Prof. Fábio Luiz</p>
            </div>
          </div>
        </div>
        <button onClick={() => window.print()} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-black shadow-xl no-print hover:bg-cyan-600 transition-colors">
           SALVAR CERTIFICADO (PDF)
        </button>
      </div>
    );
  }

  // 3. INTERFACE DO APP
  return (
    <div className="min-h-screen text-white p-4 font-sans relative selection:bg-cyan-500/30" style={{ background: "#0a192f" }}>
      
      {/* MODAL FIM DE MÓDULO */}
      {showModuleComplete && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl w-full max-w-sm text-center shadow-[0_0_50px_rgba(0,151,156,0.3)] animate-in zoom-in-95">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6 drop-shadow-lg" />
            <h2 className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Placa Dominada!</h2>
            <p className="text-slate-300 text-base mb-8 leading-relaxed">
              Extraordinário, {nomeAluno}! Você compilou os 10 programas do módulo <strong className="text-cyan-400">{MODULOS[modIdx].titulo}</strong>.<br/><br/>
              A próxima porta serial está bloqueada. <br/><span className="italic text-cyan-500 font-mono text-sm">&gt; Solicite o Jumper Key ao Prof. Fábio Luiz.</span>
            </p>
            <button 
              onClick={() => {
                setShowModuleComplete(false);
                setFeedback(null);
              }} 
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-black transition-all active:scale-95 text-white"
            >
              ENTENDIDO, PROFESSOR! 🚀
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE SENHA */}
      {showPassModal !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl border-t-4 border-t-cyan-500">
            <LockKeyhole className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2 font-mono text-cyan-100">Access_Denied</h2>
            <p className="text-slate-400 text-sm mb-4 italic">Insira a chave do administrador de hardware.</p>
            <input 
              type="password" placeholder="Chave de segurança..." 
              className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl mb-4 text-center focus:border-cyan-500 outline-none font-mono text-cyan-400 tracking-[0.5em]"
              value={passInput} onChange={e => setPassInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && tentarDesbloquear()}
            />
            <div className="flex gap-2">
              <button onClick={() => setShowPassModal(null)} className="flex-1 py-3 text-sm text-slate-400 font-mono hover:text-white">Cancelar()</button>
              <button onClick={tentarDesbloquear} className="flex-1 py-3 bg-cyan-600 rounded-xl font-bold font-mono hover:bg-cyan-500 text-white">Desbloquear()</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Cpu className="text-cyan-500" size={32} />
          <h1 className="text-2xl font-black italic tracking-tighter">ArduinoLingo<span className="text-cyan-600">_</span></h1>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-4 shadow-inner">
          <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono"><Star size={18} fill="currentColor"/> {xp} XP</div>
        </div>
      </header>

      {/* SELETOR DE MÓDULOS */}
      <nav className="max-w-5xl mx-auto flex gap-3 mb-8">
        {MODULOS.map((m, idx) => {
          const isUnlocked = unlockedMods.includes(idx);
          return (
            <button 
              key={idx}
              onClick={() => {
                if(isUnlocked) {
                  setModIdx(idx);
                  setLvlIdx(0);
                  setFase("aula");
                  setUserCode(MODULOS[idx].niveis[0].desafio.starter);
                  setFeedback(null);
                } else {
                  setShowPassModal(idx);
                }
              }}
              className={`flex-1 p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${modIdx === idx ? 'bg-cyan-900/40 border-cyan-500 shadow-lg shadow-cyan-900/20' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
            >
              <span className="text-2xl">{isUnlocked ? m.emoji : <Lock size={20} className="text-slate-600"/>}</span>
              <span className="font-bold text-[10px] uppercase tracking-widest font-mono text-cyan-100/70">{m.sigla}</span>
            </button>
          );
        })}
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit shadow-xl relative z-10">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-black">{lvl.titulo}</h2>
            <div className="text-xs bg-slate-950 px-3 py-1 rounded-full text-cyan-400 font-mono border border-slate-800">
              Módulo {modIdx + 1} • Fase {lvlIdx + 1}/10
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button onClick={() => setFase("aula")} className={`px-6 py-2 rounded-xl font-bold text-sm ${fase === "aula" ? "bg-white text-slate-900" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}>Biblioteca</button>
            <button onClick={() => setFase("desafio")} className={`px-6 py-2 rounded-xl font-bold text-sm ${fase === "desafio" ? "bg-cyan-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}>Sketch IDE</button>
          </div>

          {fase === "aula" ? (
            <div className="text-slate-300 space-y-4 animate-in fade-in">
              <p className="leading-relaxed">{lvl.aula.intro}</p>
              <div className="bg-[#0d1117] p-4 rounded-xl border border-slate-800 shadow-inner">
                <code className="text-cyan-400 text-sm font-mono whitespace-pre-wrap">{lvl.aula.blocos[0].c}</code>
              </div>
              <button onClick={() => setFase("desafio")} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group border border-slate-700">
                <Code2 size={18} className="text-cyan-500 group-hover:text-cyan-400"/> Abrir Editor <ChevronRight size={18}/>
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-2xl">
                <p className="text-sm leading-relaxed text-cyan-100"><Zap size={16} className="inline mr-2 text-cyan-400"/>{lvl.desafio.inst}</p>
              </div>
              
              {feedback && (
                <div className={`p-5 rounded-2xl border-2 animate-in zoom-in-95 ${feedback.tipo === 'ok' ? 'bg-cyan-900/20 border-cyan-500' : 'bg-red-950/40 border-red-500/50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{feedback.emoji}</span>
                    <span className={`font-black uppercase tracking-tight font-mono ${feedback.tipo === 'ok' ? 'text-cyan-400' : 'text-red-400'}`}>
                      {feedback.tipo === 'ok' ? 'Upload Finalizado!' : 'Compilation Error'}
                    </span>
                  </div>
                  {feedback.tipo === 'ok' ? (
                    <div className="space-y-4">
                      <p className="text-sm text-cyan-100/80 italic leading-relaxed font-mono">// {lvl.explicacao}</p>
                      <button onClick={proximaFase} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 text-white shadow-lg">PRÓXIMO SKETCH <ChevronRight size={14}/></button>
                    </div>
                  ) : <p className="text-xs text-red-200/80 font-mono">{feedback.msg}</p>}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="space-y-4 relative z-0 flex flex-col h-full">
          <div className="bg-[#0d1117] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex-1 flex flex-col">
            <div className="bg-slate-900 px-4 py-3 flex justify-between items-center border-b border-slate-800">
              <span className="text-xs font-mono text-slate-500 tracking-widest flex items-center gap-2"><Code2 size={14}/> sketch.ino</span>
              <div className="flex gap-2">
                <button onClick={() => setUserCode(lvl.desafio.starter)} className="p-1.5 hover:bg-slate-800 rounded text-slate-500 transition-colors"><RotateCcw size={14}/></button>
                <button onClick={analisarCodigo} className="bg-cyan-600 hover:bg-cyan-500 px-6 py-1.5 rounded-lg text-xs font-black flex items-center gap-2 shadow-lg active:scale-95 transition-all text-white"><Play size={14} fill="currentColor"/> COMPILAR</button>
              </div>
            </div>
            <textarea 
              className="w-full flex-1 min-h-[220px] bg-transparent p-5 font-mono text-sm text-blue-300 outline-none resize-none leading-relaxed"
              value={userCode} onChange={e => setUserCode(e.target.value)} spellCheck={false}
              placeholder="// Escreva seu C++ aqui..."
            />
          </div>

          <div className="bg-black rounded-3xl overflow-hidden h-40 border border-slate-800 shadow-inner p-4 font-mono text-xs flex flex-col relative group">
             <div className="text-slate-500 mb-2 flex justify-between items-center select-none border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2"><Terminal size={12}/> Monitor Serial (COM3)</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">9600 baud</span>
             </div>
             <div className="flex-1 overflow-y-auto text-green-400">
               {feedback ? (
                 <div className={`mt-1 whitespace-pre-wrap ${feedback.tipo === 'ok' ? 'text-slate-300' : 'text-red-400'}`}>
                   {feedback.sysOut}
                 </div>
               ) : (
                 <span className="text-slate-600 animate-pulse">Aguardando dados da porta serial...</span>
               )}
             </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-md p-4 no-print border-t border-slate-900 z-50">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Award size={20} className="text-cyan-500"/>
          <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-cyan-500 transition-all duration-1000" style={{width: `${(totalConcluido / 30) * 100}%`, boxShadow: "0 0 10px rgba(0,212,255,0.5)"}}/>
          </div>
          <span className="text-xs font-black text-slate-500 font-mono">{totalConcluido}/30</span>
        </div>
      </footer>

      <style>{`
        @media print { .no-print { display: none !important; } }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #334155; }
        textarea { tab-size: 2; }
      `}</style>
    </div>
  );
}