
import java.util.Scanner;

public class AddTwoNumbers {

public static int addNumbers(int num1, int num2) {
    // Implement the function
    return 0;
}

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter the first number: ");
        int number1 = scanner.nextInt();
        
        System.out.print("Enter the second number: ");
        int number2 = scanner.nextInt();

        int sum = addNumbers(number1, number2);

        System.out.println("The sum is: " + sum);
        scanner.close();
    }
}
    