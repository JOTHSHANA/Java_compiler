const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const checkJavaFeatures = (code) => {
    const cleanedCode = code.replace(/\/\/.*$/gm, '');
    const cleanedCodeWithoutMultiLine = cleanedCode.replace(/\/\*[\s\S]*?\*\//g, '');

    const hasConstructorClassName = /public\s+class\s+\w+\s*\{/g.test(cleanedCodeWithoutMultiLine);
    const hasAbstractKeyword = /\babstract\b/g.test(cleanedCodeWithoutMultiLine);
    const hasInheritance = /\bextends\b/g.test(cleanedCodeWithoutMultiLine);

    // Check if `@Override` is explicitly used
    const hasExplicitOverrideAnnotation = /@Override\s+\w+\s+\w+\s*\(.*\)/g.test(cleanedCodeWithoutMultiLine);

    // Look for method definitions that could potentially be overriding a superclass method
    const methodPattern = /(?:public|protected|private|static)?\s+\w+\s+(\w+)\s*\([^)]*\)\s*{/g;
    const methodNames = [];
    let match;
    while ((match = methodPattern.exec(cleanedCodeWithoutMultiLine)) !== null) {
        methodNames.push(match[1]);
    }
    // Check for potential overriding by looking for duplicate method names
    const hasPotentialMethodOverriding = methodNames.some((name, index) => methodNames.indexOf(name) !== index);

    // Check for method overriding based on either `@Override` or matching method names in a class with inheritance
    const hasMethodOverriding = hasInheritance && (hasExplicitOverrideAnnotation || hasPotentialMethodOverriding);

    // Check for potential method overloading
    const hasMethodOverloading =
        /(public|protected|private|static)?\s*\w+\s+\w+\s*\(.*\)\s*\{/g.test(cleanedCodeWithoutMultiLine) &&
        /(\w+)\s*\(/g.test(cleanedCodeWithoutMultiLine);

    console.log("Checks:");
    console.log("Constructor Class Name: ", hasConstructorClassName);
    console.log("Abstract Keyword: ", hasAbstractKeyword);
    console.log("Inheritance: ", hasInheritance);
    console.log("Method Overriding: ", hasMethodOverriding);
    console.log("Method Overloading: ", hasMethodOverloading);

    return hasConstructorClassName && hasAbstractKeyword && hasInheritance && hasMethodOverriding && hasMethodOverloading;
};

app.post("/validate", (req, res) => {
    const { code } = req.body;

    console.log("Received Java Code:\n", code);

    const filePath = path.join(__dirname, 'Main.java');
    fs.writeFileSync(filePath, code);

    exec(`javac ${filePath}`, (compileErr) => {
        if (compileErr) {
            console.error('Compilation Error:', compileErr);
            return res.json({ success: false, error: compileErr.message });
        }

        exec(`java -cp ${__dirname} Main`, (runErr) => {
            if (runErr) {
                console.error('Runtime Error:', runErr);
                return res.json({ success: false, error: runErr.message });
            }

            const featuresExist = checkJavaFeatures(code);
            console.log(featuresExist);
            return res.json({ success: featuresExist });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
