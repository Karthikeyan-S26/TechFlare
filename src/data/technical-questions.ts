// Technical Round Questions
export const technicalQuestions = [
  // SECTION 1: REARRANGE CODE
  {
    round: 'technical',
    section: 1,
    section_name: 'Rearrange Code',
    type: 'rearrange',
    content: 'Arrange the following lines to form a valid Java program that prints the sum of even numbers from 1 to 5.',
    code_lines: [
      'public class Numbers {',
      'public static void main(String[] args) {',
      'int sum = 0;',
      'for(int i = 1; i <= 5; i++) {',
      'if(i % 2 == 0) {',
      'sum = sum + i;',
      '}',
      '}',
      'System.out.println(sum);',
      '}',
      '}'
    ],
    shuffled_lines: [
      'public class Numbers {',
      'System.out.println(sum);',
      'int sum = 0;',
      'for(int i = 1; i <= 5; i++) {',
      'if(i % 2 == 0) {',
      'sum = sum + i;',
      '}',
      '}',
      'public static void main(String[] args) {',
      '}',
      '}'
    ],
    correct_answer: 'public class Numbers {|public static void main(String[] args) {|int sum = 0;|for(int i = 1; i <= 5; i++) {|if(i % 2 == 0) {|sum = sum + i;|}|}|System.out.println(sum);|}|}',
    marks: 2
  },
  {
    round: 'technical',
    section: 1,
    section_name: 'Rearrange Code',
    type: 'rearrange',
    content: 'Arrange the lines to correctly reverse a number.',
    code_lines: [
      'public class ReverseNumber {',
      'public static void main(String[] args) {',
      'int num = 1234;',
      'int reverse = 0;',
      'while(num != 0) {',
      'int digit = num % 10;',
      'reverse = reverse * 10 + digit;',
      'num = num / 10;',
      '}',
      'System.out.println("Reverse = " + reverse);',
      '}',
      '}'
    ],
    shuffled_lines: [
      'public class ReverseNumber {',
      'int reverse = 0;',
      'public static void main(String[] args) {',
      'while(num != 0) {',
      'int num = 1234;',
      'reverse = reverse * 10 + digit;',
      'int digit = num % 10;',
      'num = num / 10;',
      '}',
      'System.out.println("Reverse = " + reverse);',
      '}',
      '}'
    ],
    correct_answer: 'public class ReverseNumber {|public static void main(String[] args) {|int num = 1234;|int reverse = 0;|while(num != 0) {|int digit = num % 10;|reverse = reverse * 10 + digit;|num = num / 10;|}|System.out.println("Reverse = " + reverse);|}|}',
    marks: 2
  },
  
  // SECTION 2: PSEUDOCODE LOGIC
  {
    round: 'technical',
    section: 2,
    section_name: 'Pseudocode Logic',
    type: 'pseudocode',
    content: `START
A = 2
B = 3
C = 4

RESULT = A + B * C - A + C

PRINT RESULT
END

What is the output?`,
    options: ['12', '14', '16', '18'],
    correct_answer: '16',
    marks: 2
  },
  {
    round: 'technical',
    section: 2,
    section_name: 'Pseudocode Logic',
    type: 'pseudocode',
    content: `START

COUNT = 0

FOR I = 1 TO 2
   FOR J = 1 TO 3
      COUNT = COUNT + 1
   END FOR
END FOR

PRINT COUNT
END

What is the output?`,
    options: ['3', '4', '6', '9'],
    correct_answer: '6',
    marks: 2
  },
  
  // SECTION 3: FIND SYNTAX ERRORS
  {
    round: 'technical',
    section: 3,
    section_name: 'Find Syntax Errors',
    type: 'syntax_error',
    content: `public class SyntaxGame
{
    public static void main(String args[])
    {
        int x = 10
        int y = 5
        int result = 0;

        System.out.println("Program Started"

        if(x > y)
        {
            System.out.println("X is greater")
        else
        {
            System.out.println("Y is greater");
        }

        for(int i = 0; i < 5 i++)
        {
            System.out.println("Value " + i)
        }

        String text = "Debugging Game;
        System.out.println(text)

        result = x + y
        System.out.println("Result = " + result)

    }
}

How many syntax errors are present?`,
    options: ['6', '8', '10', '12'],
    correct_answer: '10',
    marks: 2
  },
  {
    round: 'technical',
    section: 3,
    section_name: 'Find Syntax Errors',
    type: 'syntax_error',
    content: `public class ErrorFinder
{
    public static void main(String args[])
    {
        int num1 == 10;
        int num2 = 20;

        double total = num1 + num2

        System.out.println("Calculation Start");

        if num1 < num2
        {
            System.out.println("Num1 is smaller");
        }

        for(int i = 1; i <= 5; i--)
        {
            System.out.println("Loop value: " + i);
        }

        char grade = "A";

        boolean flag = true
        System.out.println("Flag value = " + flag);

        String message = 'Debug Mode';
        System.out.println(message);
    }
}

How many syntax errors exist?`,
    options: ['6', '7', '8', '9'],
    correct_answer: '8',
    marks: 2
  },
  
  // SECTION 4: OUTPUT PREDICTION
  {
    round: 'technical',
    section: 4,
    section_name: 'Predict Output',
    type: 'output_prediction',
    content: `public class OutputTest1 {
    public static void main(String[] args) {
        int x = 5;
        int y = x + 3;
        x = 10;

        System.out.println(y);
        System.out.println(y);
    }
}

What is the output?`,
    options: ['8 8', '5 10', '10 10', '8 10'],
    correct_answer: '8 8',
    marks: 2
  },
  {
    round: 'technical',
    section: 4,
    section_name: 'Predict Output',
    type: 'output_prediction',
    content: `public class OutputTest4 {
    public static void main(String[] args) {
        int x = 5;

        System.out.println(x++);
        System.out.println(++x);
        System.out.println(--x);
        System.out.println(x--);
    }
}

What is the output?`,
    options: ['5 7 6 6', '5 6 5 5', '5 7 7 6', '5 6 6 6'],
    correct_answer: '5 7 6 6',
    marks: 2
  }
];
