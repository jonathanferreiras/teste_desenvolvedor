# Teste Desenvolvedor

Teste de desenvolvimento.

Você deve criar um sistema de análise de dados, onde o sistema deve importar
lotes de arquivos, ler e analisar os dados e produzir um relatório.

### Instalação

1. Instale Node.js no seu computador.

2. Clone / baixe esta pasta para o seu computador.

3. Executar o seguinte comando dentro desta pasta:
`$ yarn install`

4. Para iniciar o programa execute o seguinte comando:
`$ yarn start`

5. Só alterar os dados na pasta `/in` que irá gerar o relatório automaticamente na pasta `/out`.

### Informações

A atualização do relatório só irá ocorrer caso seja adicionado ou excluído novos arquivos na pasta `/in`.

As configurações de pasta, separador, formato do arquivo, tempo de verificação de atualização entre outros está na arquivo `src/config/analyze.js`

### Dependências

- "readdirp": "^3.3.0"