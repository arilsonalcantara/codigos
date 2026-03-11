// ==================== DEFAULT CATEGORIES ====================
const DEFAULT_CATEGORIES = [
    { id: 'viagens', name: 'Viagens', icon: '✈️', color: '#3b82f6' },
    { id: 'financas', name: 'Finanças', icon: '💰', color: '#10b981' },
    { id: 'romance', name: 'Romance', icon: '❤️', color: '#ef4444' },
    { id: 'saude', name: 'Saúde', icon: '💪', color: '#f59e0b' },
    { id: 'aventura', name: 'Aventura', icon: '🏔️', color: '#8b5cf6' },
    { id: 'gastronomia', name: 'Gastronomia', icon: '🍽️', color: '#ec4899' },
    { id: 'cultura', name: 'Cultura', icon: '🎭', color: '#6366f1' },
    { id: 'casa', name: 'Casa & Lar', icon: '🏠', color: '#14b8a6' },
    { id: 'crescimento', name: 'Crescimento', icon: '📚', color: '#f97316' },
    { id: 'diversao', name: 'Diversão', icon: '🎉', color: '#a855f7' }
];

// ==================== LEVEL DEFINITIONS ====================
const LEVELS = [
    { level: 1, title: 'Casal Sonhador', xpRequired: 0 },
    { level: 2, title: 'Dupla Dinâmica', xpRequired: 100 },
    { level: 3, title: 'Parceiros de Aventura', xpRequired: 250 },
    { level: 4, title: 'Casal Determinado', xpRequired: 500 },
    { level: 5, title: 'Dupla Imbatível', xpRequired: 800 },
    { level: 6, title: 'Casal Inspirador', xpRequired: 1200 },
    { level: 7, title: 'Companheiros de Vida', xpRequired: 1700 },
    { level: 8, title: 'Casal Lendário', xpRequired: 2300 },
    { level: 9, title: 'Alma Gêmea', xpRequired: 3000 },
    { level: 10, title: 'Casal dos Sonhos', xpRequired: 4000 }
];

// ==================== ACHIEVEMENT DEFINITIONS ====================
const ACHIEVEMENTS = [
    { id: 'first_goal', name: 'Primeiro Passo', desc: 'Crie sua primeira meta', icon: '🌱', condition: (s) => s.totalGoals >= 1 },
    { id: 'first_done', name: 'Primeira Conquista', desc: 'Conclua sua primeira meta', icon: '🎯', condition: (s) => s.completedGoals >= 1 },
    { id: '5_goals', name: 'Mão Cheia', desc: 'Crie 5 metas', icon: '🖐️', condition: (s) => s.totalGoals >= 5 },
    { id: '10_goals', name: 'Top 10', desc: 'Crie 10 metas', icon: '🔟', condition: (s) => s.totalGoals >= 10 },
    { id: '25_goals', name: 'Sonhadores', desc: 'Crie 25 metas', icon: '💭', condition: (s) => s.totalGoals >= 25 },
    { id: '50_goals', name: 'Metade do Caminho', desc: 'Crie 50 metas', icon: '🏃', condition: (s) => s.totalGoals >= 50 },
    { id: '100_goals', name: 'Lista Completa!', desc: 'Crie 100 metas', icon: '💯', condition: (s) => s.totalGoals >= 100 },
    { id: '5_done', name: 'Em Ritmo', desc: 'Conclua 5 metas', icon: '🏅', condition: (s) => s.completedGoals >= 5 },
    { id: '10_done', name: 'Imparável', desc: 'Conclua 10 metas', icon: '🔥', condition: (s) => s.completedGoals >= 10 },
    { id: '25_done', name: 'Máquina de Metas', desc: 'Conclua 25 metas', icon: '⚡', condition: (s) => s.completedGoals >= 25 },
    { id: '50_done', name: 'Meio Centenário', desc: 'Conclua 50 metas', icon: '🏆', condition: (s) => s.completedGoals >= 50 },
    { id: '100_done', name: 'Perfeição!', desc: 'Conclua todas as 100 metas', icon: '👑', condition: (s) => s.completedGoals >= 100 },
    { id: 'level_3', name: 'Subindo de Nível', desc: 'Alcance o nível 3', icon: '📈', condition: (s) => s.level >= 3 },
    { id: 'level_5', name: 'Nível 5!', desc: 'Alcance o nível 5', icon: '⭐', condition: (s) => s.level >= 5 },
    { id: 'level_10', name: 'Nível Máximo!', desc: 'Alcance o nível 10', icon: '🌟', condition: (s) => s.level >= 10 },
    { id: 'travel_5', name: 'Viajantes', desc: 'Conclua 5 metas de viagem', icon: '🗺️', condition: (s) => s.categoryDone.viagens >= 5 },
    { id: 'travel_10', name: 'Nômades Digitais', desc: 'Conclua 10 metas de viagem', icon: '🌍', condition: (s) => s.categoryDone.viagens >= 10 },
    { id: 'romance_5', name: 'Românticos', desc: 'Conclua 5 metas de romance', icon: '💕', condition: (s) => s.categoryDone.romance >= 5 },
    { id: 'all_categories', name: 'Eclético', desc: 'Tenha metas em todas as 10 categorias', icon: '🌈', condition: (s) => s.categoriesUsed >= 10 },
    { id: 'streak_week', name: 'Semana Produtiva', desc: 'Atualize metas por 7 dias seguidos', icon: '📆', condition: (s) => s.streak >= 7 },
];

// ==================== GOAL SUGGESTIONS (100+) ====================
const SUGGESTIONS = [
    // Viagens
    { title: 'Viajar para Paris', category: 'viagens' },
    { title: 'Conhecer as Cataratas do Iguaçu', category: 'viagens' },
    { title: 'Fazer uma viagem de carro pela costa', category: 'viagens' },
    { title: 'Visitar 5 países juntos', category: 'viagens', quantity: 5 },
    { title: 'Acampar sob as estrelas', category: 'viagens' },
    { title: 'Fazer um cruzeiro', category: 'viagens' },
    { title: 'Conhecer as praias do Nordeste', category: 'viagens' },
    { title: 'Visitar a Disney', category: 'viagens' },
    { title: 'Fazer uma viagem de trem', category: 'viagens' },
    { title: 'Conhecer Machu Picchu', category: 'viagens' },
    { title: 'Viajar para o Japão', category: 'viagens' },
    { title: 'Fazer mochilão pela Europa', category: 'viagens' },

    // Finanças
    { title: 'Montar uma reserva de emergência', category: 'financas' },
    { title: 'Investir juntos todo mês', category: 'financas', quantity: 12 },
    { title: 'Comprar nosso primeiro imóvel', category: 'financas' },
    { title: 'Quitar todas as dívidas', category: 'financas' },
    { title: 'Criar um negócio juntos', category: 'financas' },
    { title: 'Fazer um planejamento financeiro anual', category: 'financas' },
    { title: 'Economizar para uma viagem dos sonhos', category: 'financas' },
    { title: 'Comprar um carro novo', category: 'financas' },
    { title: 'Alcançar R$ 100 mil em investimentos', category: 'financas' },
    { title: 'Ler um livro sobre finanças juntos', category: 'financas' },

    // Romance
    { title: 'Ter 12 noites de encontro no ano', category: 'romance', quantity: 12 },
    { title: 'Escrever cartas de amor um pro outro', category: 'romance' },
    { title: 'Renovar os votos', category: 'romance' },
    { title: 'Ter um piquenique ao pôr do sol', category: 'romance' },
    { title: 'Dançar juntos sob a chuva', category: 'romance' },
    { title: 'Fazer uma sessão de fotos profissional', category: 'romance' },
    { title: 'Jantar à luz de velas em casa', category: 'romance' },
    { title: 'Assistir ao nascer do sol juntos', category: 'romance' },
    { title: 'Criar um álbum de memórias', category: 'romance' },
    { title: 'Fazer uma viagem romântica a dois', category: 'romance' },
    { title: 'Ter um dia sem tecnologia juntos', category: 'romance' },
    { title: 'Surpreender com café da manhã na cama', category: 'romance', quantity: 5 },

    // Saúde
    { title: 'Correr uma meia maratona juntos', category: 'saude' },
    { title: 'Treinar juntos 3x por semana', category: 'saude' },
    { title: 'Fazer uma dieta saudável por 30 dias', category: 'saude' },
    { title: 'Experimentar yoga juntos', category: 'saude' },
    { title: 'Completar um desafio fitness de 30 dias', category: 'saude' },
    { title: 'Aprender a meditar juntos', category: 'saude' },
    { title: 'Andar de bicicleta 10 vezes juntos', category: 'saude', quantity: 10 },
    { title: 'Participar de uma corrida juntos', category: 'saude' },
    { title: 'Fazer check-up médico anual', category: 'saude' },
    { title: 'Aprender a cozinhar refeições saudáveis', category: 'saude', quantity: 10 },

    // Aventura
    { title: 'Pular de paraquedas', category: 'aventura' },
    { title: 'Fazer rapel', category: 'aventura' },
    { title: 'Mergulhar em um recife de coral', category: 'aventura' },
    { title: 'Escalar uma montanha juntos', category: 'aventura' },
    { title: 'Fazer rafting', category: 'aventura' },
    { title: 'Fazer trilha em uma cachoeira', category: 'aventura', quantity: 5 },
    { title: 'Voar de asa-delta', category: 'aventura' },
    { title: 'Fazer tirolesa', category: 'aventura' },
    { title: 'Surfar juntos', category: 'aventura' },
    { title: 'Fazer uma trilha de vários dias', category: 'aventura' },

    // Gastronomia
    { title: 'Fazer um curso de culinária juntos', category: 'gastronomia' },
    { title: 'Experimentar 10 restaurantes novos', category: 'gastronomia', quantity: 10 },
    { title: 'Cozinhar receitas de 5 países diferentes', category: 'gastronomia', quantity: 5 },
    { title: 'Fazer um jantar temático em casa', category: 'gastronomia' },
    { title: 'Aprender a fazer sushi juntos', category: 'gastronomia' },
    { title: 'Visitar uma vinícola', category: 'gastronomia' },
    { title: 'Fazer uma degustação de queijos e vinhos', category: 'gastronomia' },
    { title: 'Criar uma receita original juntos', category: 'gastronomia' },
    { title: 'Fazer um churrasco perfeito', category: 'gastronomia' },
    { title: 'Aprender a fazer pães artesanais', category: 'gastronomia' },
    { title: 'Fazer um brunch especial no domingo', category: 'gastronomia', quantity: 6 },

    // Cultura
    { title: 'Assistir 10 peças de teatro', category: 'cultura', quantity: 10 },
    { title: 'Visitar 5 museus juntos', category: 'cultura', quantity: 5 },
    { title: 'Ir a um concerto ou show ao vivo', category: 'cultura', quantity: 5 },
    { title: 'Ler o mesmo livro e discutir juntos', category: 'cultura', quantity: 3 },
    { title: 'Aprender um idioma juntos', category: 'cultura' },
    { title: 'Assistir a um festival de cinema', category: 'cultura' },
    { title: 'Visitar uma feira de arte', category: 'cultura' },
    { title: 'Fazer um curso online juntos', category: 'cultura' },
    { title: 'Maratonar uma série clássica', category: 'cultura', quantity: 5 },
    { title: 'Ir a uma exposição de arte', category: 'cultura' },

    // Casa & Lar
    { title: 'Decorar a casa juntos', category: 'casa' },
    { title: 'Criar um jardim ou horta', category: 'casa' },
    { title: 'Reformar um cômodo da casa', category: 'casa' },
    { title: 'Montar um espaço de leitura aconchegante', category: 'casa' },
    { title: 'Organizar todas as fotos em álbuns', category: 'casa' },
    { title: 'Adotar um pet juntos', category: 'casa' },
    { title: 'Fazer uma noite de jogos semanalmente', category: 'casa', quantity: 20 },
    { title: 'Pintar um quadro juntos', category: 'casa' },
    { title: 'Criar uma cápsula do tempo do casal', category: 'casa' },
    { title: 'Montar um home cinema', category: 'casa' },

    // Crescimento
    { title: 'Fazer terapia de casal', category: 'crescimento' },
    { title: 'Ler 12 livros juntos no ano', category: 'crescimento', quantity: 12 },
    { title: 'Fazer um retiro espiritual juntos', category: 'crescimento' },
    { title: 'Definir metas anuais como casal', category: 'crescimento' },
    { title: 'Fazer um curso de comunicação', category: 'crescimento' },
    { title: 'Participar de um workshop juntos', category: 'crescimento' },
    { title: 'Escrever um diário do casal', category: 'crescimento' },
    { title: 'Aprender uma habilidade nova juntos', category: 'crescimento', quantity: 3 },
    { title: 'Assistir palestras TED juntos', category: 'crescimento', quantity: 10 },
    { title: 'Fazer voluntariado juntos', category: 'crescimento', quantity: 3 },

    // Diversão
    { title: 'Ir a um parque de diversões', category: 'diversao' },
    { title: 'Fazer karaokê juntos', category: 'diversao' },
    { title: 'Jogar paintball ou laser tag', category: 'diversao' },
    { title: 'Fazer uma festa temática', category: 'diversao' },
    { title: 'Ir a um parque aquático', category: 'diversao' },
    { title: 'Fazer uma guerra de travesseiros épica', category: 'diversao' },
    { title: 'Jogar escape room', category: 'diversao', quantity: 3 },
    { title: 'Fazer um dia de spa juntos', category: 'diversao' },
    { title: 'Ir a um jogo de futebol juntos', category: 'diversao' },
    { title: 'Montar um quebra-cabeça de 1000 peças', category: 'diversao' },
    { title: 'Fazer uma maratona de filmes', category: 'diversao', quantity: 5 },
    { title: 'Participar de um quiz em bar', category: 'diversao' },
];
