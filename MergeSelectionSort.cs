using System;

namespace MergeSeleção
{
    class Program
    {
        static void Main(string[] args)
        {
            int[] Aleatorio = new int[6]; //criando o vetor que receberá a ordem aleatória

            int[] Ordenado = new int[6]; // criando o vetor que receberá a lista ordenada

            Random random = new Random(); //metódo para gerar elementos aleatórios


            Console.WriteLine("Elementos orginal da lista");

            //a condição abaixo é para preencher o vetor Aleatório com elemento sorteados

            for (int i = 0; i < Aleatorio.Length; i++)
            {
                Aleatorio[i] = random.Next(0, 100);
                Console.Write(Aleatorio[i] + " ");
            }

            Console.WriteLine();


            Ordenado = Merge(Aleatorio); //chamando a função que vai fazer um início do MergeSort


            Console.WriteLine("Elementos ordenados");

            //percorrendo o array ordenado, e escrevendo sua ordem na tela

            foreach (int x in Ordenado)
            {
                Console.Write(x + " ");
            }

            Console.Write("\n");

            Console.ReadKey();
        }



        public static int[] Merge(int[] Aleatorio)
        {
            //condição de parada da função
            if (Aleatorio.Length <= 1)
                return Aleatorio;

            /*abaixo crio 3 vetores
             * 1 - Que receberá a lista Ordenada
             * 2 - Que receberá os elementos que ficarão do lado esquerdo do subvetor
             * 3 - Que receberá os elementos que ficarão do lado direito do subvetor
             */

            int[] ordenado = new int[Aleatorio.Length];
            int[] esquerdo;
            int[] direito;


            int meio = Aleatorio.Length / 2;

            esquerdo = new int[meio];


            if (Aleatorio.Length % 2 == 0)
                direito = new int[meio];

            else
                direito = new int[meio + 1];

            /*Agora que já achamos o meio do array que está desorganizado, vamos popular o subvetor
             * Dessa forma colocamos que a repetição vai acontecer enquanto o i for menor que o meio
             * Uma vez que o meio é a última posição do subvetor
             */

            for (int i = 0; i < meio; i++)
            {
                esquerdo[i] = Aleatorio[i];
            }


            /*Nessa repetição abaixo, é necessário criar uma variável para controlar a posição do subvetor direito
             * Iniciamos o "i" sendo o meio, pois é onde está o primeiro elemento após o meio do vetor
             * O "j" é para andar com a posição do vetorm e inicia em 0, pois é necessário preencher o inicio do subvetor
             */

            int j = 0;

            for (int i = meio; i < Aleatorio.Length; i++)
            {
                direito[j] = Aleatorio[i];
                j++;
            }

            ordenado = Selecao(esquerdo, direito); // chamando a função para o método de ordenação Selection Sort

            return ordenado;
        }


        public static int[] Selecao(int[] esquerdo, int[] direito)
        {
            int resultjuncao = esquerdo.Length + direito.Length; //armazenando o tamanho total dos subvetores

            int[] resultfinal = new int[resultjuncao]; //criando um vetor com o tamanho total necessário

            int posmin, temp; //criando variáveis para posição menor e uma variável para armazenar um elemento temporário

            for (int i = 0; i < esquerdo.Length - 1; i++) //coloco o tamanho do vetor -1, pois não preciso fazer verificação com a própria posição
            {
                posmin = i; //colocando a posição de "i" (ou a primeira posição) como a menor do array

                for (int j = i + 1; j < esquerdo.Length; j++) //coloco i+1 para comparar com o próxima posição, otimizando o códgio
                {
                    //abaixo verifico se a posição atual é menor que posição que declarei como menor
                    if (esquerdo[j] < esquerdo[posmin])
                    {
                         
                        posmin = j; //se for verdadeiro, o nova posição menor recebe a posição atual
                    }
                }


                if (posmin != i) //quando posição menor for diferente de "i" realizo a troca dos elementos
                {
                    temp = esquerdo[i];
                    esquerdo[i] = esquerdo[posmin];
                    esquerdo[posmin] = temp;
                }
            }

            for (int i = 0; i < direito.Length - 1; i++)
            {
                posmin = i;

                for (int y = i + 1; y < direito.Length; y++)
                {
                    if (direito[y] < direito[posmin])
                    {

                        posmin = y;
                    }
                }


                if (posmin != i)
                {
                    temp = direito[i];
                    direito[i] = direito[posmin];
                    direito[posmin] = temp;
                }
            }

            resultfinal = MergeSelecao(esquerdo, direito); //chamando a função para unir os subvetores e ordena-los
            return resultfinal;
        }

        public static int[] MergeSelecao(int[] esquerdo, int[] direito)
        {
            int resultjuncao = esquerdo.Length + direito.Length;

            int[] resultado = new int[resultjuncao];

            int posmin;

            for (int i = 0; i < esquerdo.Length; i++)
            {

                resultado[i] = esquerdo[i];

            }

            
            int meio = resultado.Length / 2;
            int x = meio;


            for (int i = 0; i < direito.Length; i++)
            {
                resultado[x] = direito[i];
                x++;
            }

            for (int i = 0; i < resultado.Length - 1; i++)
            {
                posmin = i;

                for (int j = i + 1; j < resultado.Length; j++)
                {
                    if (resultado[j] < resultado[posmin])
                    {

                        posmin = j;
                    }
                }


                if (posmin != i)
                {
                    int temp = resultado[i];
                    resultado[i] = resultado[posmin];
                    resultado[posmin] = temp;
                }
            }

            return resultado;
        }
    }
}
