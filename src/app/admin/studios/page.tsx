'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Studio } from '@/types/studio'

export default function StudiosAdminPage() {
  const [studios, setStudios] = useState<Studio[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [gympassFilter, setGympassFilter] = useState('')
  const [totalpassFilter, setTotalpassFilter] = useState('')
  const [clienteFilter, setClienteFilter] = useState('')
  const [destaqueFilter, setDestaqueFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 20


  useEffect(() => {
    fetchStudios()
  }, [search, cityFilter, gympassFilter, totalpassFilter, clienteFilter, destaqueFilter, page])

  const fetchStudios = async () => {
    setLoading(true)
    
    let query = supabase
      .from('studios')
      .select('*', { count: 'exact' })
      .order('title')
      .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)

    if (search) {
      query = query.or(`title.ilike.%${search}%,neighborhood.ilike.%${search}%,city.ilike.%${search}%`)
    }

    if (cityFilter) {
      query = query.eq('city', cityFilter)
    }

    if (gympassFilter === 'true') {
      query = query.eq('gympass', true)
    } else if (gympassFilter === 'false') {
      query = query.eq('gympass', false)
    }

    if (totalpassFilter === 'true') {
      query = query.eq('totalpass', true)
    } else if (totalpassFilter === 'false') {
      query = query.eq('totalpass', false)
    }

    if (clienteFilter === 'true') {
      query = query.eq('cliente', true)
    } else if (clienteFilter === 'false') {
      query = query.eq('cliente', false)
    }

    if (destaqueFilter === 'true') {
      query = query.gt('destaque', 0)
    } else if (destaqueFilter === 'false') {
      query = query.eq('destaque', 0)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Erro ao buscar estúdios:', error)
    } else {
      setStudios(data || [])
      setTotalCount(count || 0)
    }

    setLoading(false)
  }

  const deleteStudio = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este estúdio?')) return

    const { error } = await supabase
      .from('studios')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erro ao deletar estúdio: ' + error.message)
    } else {
      alert('Estúdio deletado com sucesso!')
      fetchStudios()
    }
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
                ← Voltar ao Admin
              </Link>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                Gerenciar Estúdios
              </h1>
            </div>
            <div className="flex items-center">
              <Link
                href="/admin/studios/novo"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Novo Estúdio
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Filtros */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <input
                  type="text"
                  placeholder="Nome, bairro ou cidade..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas</option>
                  <option value="São Paulo">São Paulo</option>
                  <option value="Rio de Janeiro">Rio de Janeiro</option>
                  <option value="Belo Horizonte">Belo Horizonte</option>
                  <option value="Curitiba">Curitiba</option>
                  <option value="Brasília">Brasília</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gympass
                </label>
                <select
                  value={gympassFilter}
                  onChange={(e) => setGympassFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="true">Aceita</option>
                  <option value="false">Não aceita</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TotalPass
                </label>
                <select
                  value={totalpassFilter}
                  onChange={(e) => setTotalpassFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="true">Aceita</option>
                  <option value="false">Não aceita</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <select
                  value={clienteFilter}
                  onChange={(e) => setClienteFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="true">É cliente</option>
                  <option value="false">Não é cliente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destaque
                </label>
                <select
                  value={destaqueFilter}
                  onChange={(e) => setDestaqueFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="true">Em destaque</option>
                  <option value="false">Sem destaque</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Estúdios ({totalCount})
              </h3>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-500">Carregando...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Localização
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avaliação
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Convênios
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studios.map((studio) => (
                        <tr key={studio.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {studio.title}
                              </div>
                              {(studio.destaque || 0) > 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Destaque {studio.destaque}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>
                              <div>{studio.neighborhood}</div>
                              <div className="text-xs text-gray-400">{studio.city}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>
                              <div>⭐ {(studio.totalScore || 0).toFixed(1)}</div>
                              <div className="text-xs text-gray-400">
                                {studio.reviewsCount || 0} avaliações
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex flex-col space-y-1">
                              {studio.gympass && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  Gympass
                                </span>
                              )}
                              {studio.totalpass && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  TotalPass
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {studio.cliente ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Cliente
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                Não cliente
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Link
                                href={`/admin/studios/editar/${studio.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Editar
                              </Link>
                              <button
                                onClick={() => deleteStudio(studio.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Deletar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Próxima
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Mostrando{' '}
                          <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> a{' '}
                          <span className="font-medium">
                            {Math.min(page * itemsPerPage, totalCount)}
                          </span> de{' '}
                          <span className="font-medium">{totalCount}</span> resultados
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Anterior
                          </button>
                          
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  pageNum === page
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            )
                          })}
                          
                          <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Próxima
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}