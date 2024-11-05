
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Child child = new Child(); // This will invoke the constructor in Child and Parent
        child.display();           // Calls the display method in Child
        child.calculate(5, 10);    // Calls the overridden calculate method
        child.showDetails("Sample message"); // Demonstrates method overloading
    }
}

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

    