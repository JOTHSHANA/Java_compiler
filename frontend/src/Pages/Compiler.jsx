import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const CodeMirrorCompiler = () => {
    const mainClassCode = `
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Child child = new Child(); // This will invoke the constructor in Child and Parent
        child.display();           // Calls the display method in Child
        child.calculate(5, 10);    // Calls the overridden calculate method
        child.showDetails("Sample message"); // Demonstrates method overloading
    }
}

 // FUNCTION_PLACEHOLDER

    `;

    const [functionCode, setFunctionCode] = useState(`
abstract class Parent {
    public Parent() {
        System.out.println("Parent constructor");
    }

    abstract void calculate(int a, int b);

    void showDetails() {
        System.out.println("Showing details with no parameters.");
    }

    void showDetails(String message) {
        System.out.println("Showing details: " + message);
    }
} 

class Child extends Parent {
    public Child() {
        System.out.println("Child constructor");
    }
    void calculate(int a, int b) {
        System.out.println("Child calculation: " + (a + b));
    }

    void display() {
        System.out.println("Child class display method");
    }
}


    `);

    const handleCompile = async () => {
        const fullCode = mainClassCode.replace(
            "// FUNCTION_PLACEHOLDER",
            functionCode.trim()
        );

        try {
            const response = await axios.post("http://localhost:5000/validate", {
                code: fullCode,
            });
            console.log("Backend Response:", response.data);
            alert(response.data.success ? "Validation successful! Code has all required features." : "Validation failed! Code is missing required features.");
        } catch (error) {
            console.error("Error sending code to backend:", error);
            alert("Error occurred while validating code.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Read-Only Main Class</h2>
            <Editor
                height="200px"
                defaultLanguage="java"
                value={mainClassCode}
                options={{
                    readOnly: true,
                    automaticLayout: true,
                }}
            />

            <h2>Editable Function</h2>
            <Editor
                height="200px"
                defaultLanguage="java"
                value={functionCode}
                options={{
                    automaticLayout: true,
                }}
                onChange={(value) => setFunctionCode(value)}
            />

            <button onClick={handleCompile} style={{ marginTop: "20px" }}>
                Compile Code
            </button>
        </div>
    );
};

export default CodeMirrorCompiler;
