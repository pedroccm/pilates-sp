-- Atualizar content_file dos posts do blog para apontar para os arquivos MDX corretos

UPDATE blog_posts SET content_file = 'beneficios-pilates-ciencia.mdx' 
WHERE slug = '10-beneficios-pilates-comprovados-ciencia';

UPDATE blog_posts SET content_file = 'como-escolher-studio-pilates.mdx' 
WHERE slug = 'como-escolher-melhor-estudio-pilates-12-dicas-essenciais';

UPDATE blog_posts SET content_file = 'pilates-gravidez-beneficios-cuidados.mdx' 
WHERE slug = 'pilates-gravidez-beneficios-cuidados-exercicios-seguros';

UPDATE blog_posts SET content_file = 'pilates-solo-vs-aparelhos.mdx' 
WHERE slug = 'pilates-mat-vs-reformer-diferencas-vantagens-escolher';

UPDATE blog_posts SET content_file = 'pilates-vs-musculacao.mdx' 
WHERE slug = 'pilates-vs-yoga-qual-escolher-diferencas-beneficios';

UPDATE blog_posts SET content_file = 'pilates-iniciantes-guia-completo-2025.mdx' 
WHERE slug = 'precos-pilates-2025-guia-completo-cidade';

UPDATE blog_posts SET content_file = 'melhores-exercicios-pilates-postura.mdx' 
WHERE slug = 'melhores-estudios-pilates-sao-paulo-regiao-2025';

UPDATE blog_posts SET content_file = 'pilates-idosos-exercicios-seguros.mdx' 
WHERE slug IN (
    SELECT slug FROM blog_posts 
    WHERE slug NOT IN (
        '10-beneficios-pilates-comprovados-ciencia',
        'como-escolher-melhor-estudio-pilates-12-dicas-essenciais',
        'pilates-gravidez-beneficios-cuidados-exercicios-seguros',
        'pilates-mat-vs-reformer-diferencas-vantagens-escolher',
        'pilates-vs-yoga-qual-escolher-diferencas-beneficios',
        'precos-pilates-2025-guia-completo-cidade',
        'melhores-estudios-pilates-sao-paulo-regiao-2025'
    ) 
    LIMIT 1
);