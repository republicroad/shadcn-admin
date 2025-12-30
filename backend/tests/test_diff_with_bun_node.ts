
// tsconfig.json config "module": "ES2022",  
console.log(import.meta.dir);  // "/absolute/path/to/project/src"
console.log(import.meta.path); // "/absolute/path/to/project/src/index.ts"
console.log("__dirname:", __dirname);  // "/absolute/path/to/project/src"
console.log("__filename:", __filename); // "/absolute/path/to/project/src/index.ts"
