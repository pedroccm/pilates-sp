import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const blogCategories = [
    { name: 'Guias para Iniciantes', href: '/blog/categoria/guias-iniciantes' },
    { name: 'Benefícios e Saúde', href: '/blog/categoria/beneficios-saude' },
    { name: 'Guias por Cidade', href: '/blog/categoria/guias-cidade' },
    { name: 'Comparações', href: '/blog/categoria/comparacoes-escolhas' }
  ]

  const popularTags = [
    { name: 'Iniciantes', href: '/blog/tag/iniciantes' },
    { name: 'Mat Pilates', href: '/blog/tag/mat-pilates' },
    { name: 'Reformer', href: '/blog/tag/reformer' },
    { name: 'Benefícios', href: '/blog/tag/beneficios' },
    { name: 'São Paulo', href: '/blog/tag/sao-paulo' },
    { name: 'Rio de Janeiro', href: '/blog/tag/rio-de-janeiro' }
  ]

  const cities = [
    { name: 'São Paulo', href: '/' },
    { name: 'Rio de Janeiro', href: '/rj' },
    { name: 'Belo Horizonte', href: '/bh' },
    { name: 'Brasília', href: '/bsb' },
    { name: 'Curitiba', href: '/cwb' }
  ]

  const company = [
    { name: 'Sobre nós', href: '/sobre' },
    { name: 'Como funciona', href: '/como-funciona' },
    { name: 'Para estúdios', href: '/para-estudios' },
    { name: 'Contato', href: '/contato' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="ml-2 text-xl font-bold">Pilates SP</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              A maior plataforma para encontrar estúdios de Pilates no Brasil. 
              Compare preços, avaliações e encontre o ideal para você.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.624 5.367 11.99 11.988 11.99s11.99-5.366 11.99-11.99C24.007 5.367 18.641.001 12.017.001zm0 21.165c-5.056 0-9.178-4.122-9.178-9.178 0-5.056 4.122-9.178 9.178-9.178 5.056 0 9.178 4.122 9.178 9.178 0 5.056-4.122 9.178-9.178 9.178z"/>
                  <path d="M16.948 5.076c-1.434 0-2.598 1.164-2.598 2.598v8.652c0 1.434 1.164 2.598 2.598 2.598h-9.896c-1.434 0-2.598-1.164-2.598-2.598V7.674c0-1.434 1.164-2.598 2.598-2.598h9.896z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Cidades
            </h3>
            <ul className="space-y-3">
              {cities.map((city) => (
                <li key={city.name}>
                  <Link 
                    href={city.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Blog - Categorias
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/blog"
                  className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Todos os Posts
                </Link>
              </li>
              {blogCategories.map((category) => (
                <li key={category.name}>
                  <Link 
                    href={category.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tags */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Tags Populares
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Link
                  key={tag.name}
                  href={tag.href}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-2 py-1 rounded text-xs transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Empresa
            </h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Newsletter Pilates SP</h3>
              <p className="text-gray-400 text-sm">
                Receba dicas, guias e novidades sobre Pilates direto no seu email.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Seu email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors whitespace-nowrap">
                Inscrever-se
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © {currentYear} Pilates SP. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacidade" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacidade
              </Link>
              <Link href="/termos" className="text-gray-400 hover:text-white text-sm transition-colors">
                Termos de Uso
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}