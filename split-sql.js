const fs = require('fs');

function splitSqlFile() {
  const inputFile = 'D:\\sites\\pilates-sp\\inserts-studios.sql';
  const content = fs.readFileSync(inputFile, 'utf8');
  
  // Dividir por INSERTs
  const lines = content.split('\n');
  const inserts = [];
  let currentInsert = [];
  let header = [];
  let inHeader = true;
  
  for (const line of lines) {
    if (inHeader && line.startsWith('INSERT')) {
      inHeader = false;
      header = lines.slice(0, lines.indexOf(line));
    }
    
    if (line.startsWith('INSERT')) {
      if (currentInsert.length > 0) {
        inserts.push(currentInsert.join('\n'));
      }
      currentInsert = [line];
    } else if (currentInsert.length > 0) {
      currentInsert.push(line);
    }
  }
  
  // Adicionar último insert
  if (currentInsert.length > 0) {
    inserts.push(currentInsert.join('\n'));
  }
  
  console.log(`Total de ${inserts.length} INSERTs encontrados`);
  
  // Dividir em 3 partes
  const part1Size = Math.ceil(inserts.length / 3);
  const part2Size = Math.ceil((inserts.length - part1Size) / 2);
  
  const part1 = inserts.slice(0, part1Size);
  const part2 = inserts.slice(part1Size, part1Size + part2Size);
  const part3 = inserts.slice(part1Size + part2Size);
  
  // Criar arquivos
  const headerText = header.join('\n') + '\n';
  
  // Parte 1
  const file1Content = headerText + part1.join('\n\n') + `\n\n-- Parte 1 de 3 - ${part1.length} estúdios`;
  fs.writeFileSync('D:\\sites\\pilates-sp\\inserts-studios-1.sql', file1Content, 'utf8');
  
  // Parte 2
  const file2Content = headerText + part2.join('\n\n') + `\n\n-- Parte 2 de 3 - ${part2.length} estúdios`;
  fs.writeFileSync('D:\\sites\\pilates-sp\\inserts-studios-2.sql', file2Content, 'utf8');
  
  // Parte 3
  const file3Content = headerText + part3.join('\n\n') + `\n\n-- Parte 3 de 3 - ${part3.length} estúdios`;
  fs.writeFileSync('D:\\sites\\pilates-sp\\inserts-studios-3.sql', file3Content, 'utf8');
  
  console.log(`✅ Arquivos divididos:`);
  console.log(`📄 inserts-studios-1.sql - ${part1.length} estúdios`);
  console.log(`📄 inserts-studios-2.sql - ${part2.length} estúdios`);
  console.log(`📄 inserts-studios-3.sql - ${part3.length} estúdios`);
}

splitSqlFile();