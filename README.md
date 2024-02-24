# Extensão `fix-imports`

## Descrição

A extensão `fix-imports` é uma ferramenta para ajudar na formatação e organização de declarações de importação em arquivos JavaScript e TypeScript no VSCode. Ela oferece funcionalidades para ajustar automaticamente as importações com base em configurações definidas pelo usuário.

## Funcionalidades

- Formatação automática de declarações de importação.
- Ordenação de importações de acordo com as preferências do usuário.
- Suporte para configuração de importações específicas de bibliotecas.

## Uso

1. Instale a extensão `fix-imports` no VSCode.
2. Abra um arquivo JavaScript ou TypeScript.
3. Para ajustar as importações no arquivo atual, você pode:
   - Utilizar o atalho de teclado associado ao comando "fix-imports.fix".
   - Clicar com o botão direito no editor e selecionar a opção "Fix files import".

## Configuração

A extensão `fix-imports` pode ser configurada por meio do arquivo `settings.json` do VSCode. Abaixo está um exemplo de como configurar as opções disponíveis:

- **`endPath`**: Caminho para o diretório onde os arquivos da biblioteca estão localizados.
- **`includeIndexFile`**: Indica se o arquivo de índice da biblioteca deve ser incluído na importação.
- **`customFilesEndPaths`**: Objeto que mapeia o nome do arquivo para um caminho personalizado.

### Exemplo 1:

```json
{
  "fix-imports.libs": [
    {
      "lib": "my-lib",
      "endPath": "dist",
      "includeIndexFile": true,
      "customFilesEndPaths": {
        "CustomFile": {
          "forceEndPath": "custom-file"
        }
      }
    }
  ]
}
```

- **`old import`**: `import myLib from 'my-lib';`
- **`new import`**: `import myLib from 'my-lib/dist/index.js';`

- **`custom file import`**: `import CustomFile from 'my-lib';`
- **`new custom file import`**: `import CustomFile from 'my-lib/custom-file';`

### Exemplo 2:

```json
{
  "fix-imports.libs": [
    {
      "lib": "my-example-lib",
      "includeIndexFile": true
    }
  ]
}
```

- **`old import`**: `import myExampleLib from 'my-example-lib';`
- **`new import`**: `import myExampleLib from 'my-example-lib/index.js';`

### Exemplo 3:

```json
{
  "fix-imports.libs": [
    {
      "lib": "my-lib",
      "includeIndexFile": true
    }
  ]
}
```

- **`old import`**: `import Form from 'my-lib/components/form';`
- **`new import`**: `import Form from 'my-lib/components/form/index.js';`

## Comandos

- **`fix-imports.fix`**: Ajusta as importações no arquivo atual.

## Settings

- **`fix-imports.libs`**: Lista de bibliotecas que devem ser consideradas ao ajustar as importações.
