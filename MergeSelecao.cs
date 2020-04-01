using System;

namespace MergeSeleção
{
    class Program
    {
        static void Main(string[] args)
        {
            int[] Aleatorio = new int[4];

            int[] Ordenado = new int[4];

            Random random = new Random();

            Console.WriteLine("Elementos orginal da lista");
            for (int i = 0; i < Aleatorio.Length; i++)
            {
                Aleatorio[i] = random.Next(0, 100);
                Console.Write(Aleatorio[i] + " ");
            }

            Console.WriteLine();

            Ordenado = Merge(Aleatorio);

            Console.WriteLine("Elementos ordenados");
            foreach (int x in Ordenado)
            {
                Console.Write(x + " ");
            }

            Console.Write("\n");

            Console.ReadKey();
        }

        public static int[] Merge(int[] Aleatorio)
        {
            if (Aleatorio.Length <= 1)
                return Aleatorio;


            int[] ordenado = new int[Aleatorio.Length];
            int[] esquerdo;
            int[] direito;

            int meio = Aleatorio.Length / 2;

            esquerdo = new int[meio];


            if (Aleatorio.Length % 2 == 0)
                direito = new int[meio];

            else
                direito = new int[meio + 1];


            for (int i = 0; i < meio; i++)
            {
                esquerdo[i] = Aleatorio[i];
            }

            int j = 0;

            for (int i = meio; i < Aleatorio.Length; i++)
            {
                direito[j] = Aleatorio[i];
                j++;
            }

            /*esquerdo = MergeSort(esquerdo);
            direito = MergeSort(direito);*/

            ordenado = Selecao(esquerdo, direito);
            return ordenado;
        }

        public static int[] Selecao(int[] esquerdo, int[] direito)
        {
            int resultjuncao = esquerdo.Length + direito.Length;

            int[] resultfinal = new int[resultjuncao];

            int posmin, temp;

            for (int i = 0; i < esquerdo.Length - 2; i++)
            {
                posmin = i;

                for (int j = i + 2; j < esquerdo.Length; j++)
                {
                    if (esquerdo[j] < esquerdo[posmin])
                    {

                        posmin = j;
                    }
                }


                if (posmin != i)
                {
                    temp = esquerdo[i];
                    esquerdo[i] = esquerdo[posmin];
                    esquerdo[posmin] = temp;
                }
            }

            for (int i = 0; i < direito.Length - 2; i++)
            {
                posmin = i;

                for (int j = i + 2; j < direito.Length; j++)
                {
                    if (direito[j] < direito[posmin])
                    {

                        posmin = j;
                    }
                }


                if (posmin != i)
                {
                    temp = direito[i];
                    direito[i] = direito[posmin];
                    direito[posmin] = temp;
                }
            }

            resultfinal = MergeSelecao(esquerdo, direito);
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

            int x = 0;

            for (int i = (resultado.Length / 2); i < direito.Length; i++)
            {
                resultado[0] = direito[i];
                x++;
            }

            for (int i = 0; i < resultado.Length - 2; i++)
            {
                posmin = i;

                for (int j = i + 2; j < resultado.Length; j++)
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
