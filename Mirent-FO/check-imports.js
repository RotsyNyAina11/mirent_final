import fs from "fs";
import path from "path";

// Dossier à scanner (frontend)
const ROOT_DIR = path.join(process.cwd(), "src");

// Fonction pour lister tous les fichiers .ts/.tsx
function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath));
    } else if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
      results.push(filePath);
    }
  });
  return results;
}

// Vérifie si un import correspond bien à un vrai fichier/dossier
function checkImports(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const regex = /from\s+["'](.+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith(".")) {
      const resolvedPath = path.resolve(path.dirname(filePath), importPath);
      const dirname = path.dirname(resolvedPath);
      const basename = path.basename(resolvedPath);

      if (fs.existsSync(dirname)) {
        const files = fs.readdirSync(dirname);
        const exactMatch = files.find(
          (f) => f.replace(/\.(ts|tsx|js|jsx)$/, "") === basename
        );

        if (!exactMatch) {
          console.log(
            `❌ Mauvais import dans ${filePath}: '${importPath}' (vérifie la casse)`
          );
        }
      }
    }
  }
}

// Lancer le scan
console.log("🔍 Scan des imports dans src/ ...\n");
const files = getAllFiles(ROOT_DIR);
files.forEach(checkImports);
console.log("\n✅ Scan terminé.");
