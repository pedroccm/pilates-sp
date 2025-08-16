'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface City {
  code: string
  name: string
}

const cities: City[] = [
  { code: 'sp', name: 'São Paulo' },
  { code: 'rj', name: 'Rio de Janeiro' },
  { code: 'bh', name: 'Belo Horizonte' },
  { code: 'cwb', name: 'Curitiba' },
  { code: 'bsb', name: 'Brasília' },
  { code: 'fortaleza', name: 'Fortaleza' },
  { code: 'salvador', name: 'Salvador' },
  { code: 'manaus', name: 'Manaus' },
  { code: 'recife', name: 'Recife' },
  { code: 'porto-alegre', name: 'Porto Alegre' },
  { code: 'goiania', name: 'Goiânia' },
  { code: 'campinas', name: 'Campinas' },
  { code: 'guarulhos', name: 'Guarulhos' },
  { code: 'santos', name: 'Santos' },
  { code: 'osasco', name: 'Osasco' },
  { code: 'sorocaba', name: 'Sorocaba' },
  { code: 'ribeirao-preto', name: 'Ribeirão Preto' },
  { code: 'santo-andre', name: 'Santo André' },
  { code: 'sao-jose-dos-campos', name: 'São José dos Campos' },
  { code: 'jundiai', name: 'Jundiaí' },
  { code: 'piracicaba', name: 'Piracicaba' },
  { code: 'barueri', name: 'Barueri' },
  { code: 'sao-bernardo', name: 'São Bernardo do Campo' },
  { code: 'franca', name: 'Franca' },
  { code: 'londrina', name: 'Londrina' },
  { code: 'sao-jose-do-rio-preto', name: 'São José do Rio Preto' },
  { code: 'florianopolis', name: 'Florianópolis' },
  { code: 'campo-grande', name: 'Campo Grande' },
  { code: 'cuiaba', name: 'Cuiabá' },
  { code: 'maceio', name: 'Maceió' },
  { code: 'belem', name: 'Belém' },
  { code: 'duque-de-caxias', name: 'Duque de Caxias' }
]

export default function CitySelection() {
  const [userLocation, setUserLocation] = useState<string | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verificar se já há uma cidade salva no localStorage
    const savedCity = localStorage.getItem('selectedCity')
    if (savedCity) {
      setUserLocation(savedCity)
    }
  }, [])

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador')
      return
    }

    setGeoLoading(true)
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // Usar API de geocoding para determinar a cidade
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
          )
          
          const data = await response.json()
          const city = data.city || data.locality || data.principalSubdivision
          
          // Mapear para nossas cidades disponíveis
          const detectedCity = mapLocationToCity(city, data.principalSubdivision)
          
          if (detectedCity) {
            setUserLocation(detectedCity)
            localStorage.setItem('selectedCity', detectedCity)
            
            // Redirecionar automaticamente sem perguntar
            router.push(`/${detectedCity}`)
          } else {
            alert('Não conseguimos detectar uma cidade suportada. Por favor, selecione manualmente.')
          }
        } catch (error) {
          console.error('Erro ao detectar localização:', error)
          alert('Erro ao detectar sua localização. Por favor, selecione manualmente.')
        } finally {
          setGeoLoading(false)
        }
      },
      (error) => {
        setGeoLoading(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Permissão de localização negada. Por favor, selecione sua cidade manualmente.')
            break
          case error.POSITION_UNAVAILABLE:
            alert('Localização indisponível. Por favor, selecione sua cidade manualmente.')
            break
          case error.TIMEOUT:
            alert('Tempo limite para detectar localização. Por favor, selecione sua cidade manualmente.')
            break
          default:
            alert('Erro ao detectar localização. Por favor, selecione sua cidade manualmente.')
            break
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    )
  }

  const mapLocationToCity = (city: string, state: string): string | null => {
    const cityLower = city?.toLowerCase() || ''
    const stateLower = state?.toLowerCase() || ''
    
    if (cityLower.includes('são paulo') || cityLower.includes('sao paulo') || stateLower.includes('são paulo')) {
      return 'sp'
    }
    if (cityLower.includes('rio de janeiro') || stateLower.includes('rio de janeiro')) {
      return 'rj'
    }
    if (cityLower.includes('belo horizonte') || stateLower.includes('minas gerais')) {
      return 'bh'
    }
    if (cityLower.includes('curitiba') || stateLower.includes('paraná')) {
      return 'cwb'
    }
    if (cityLower.includes('brasília') || cityLower.includes('brasilia') || stateLower.includes('distrito federal')) {
      return 'bsb'
    }
    
    return null
  }

  const getCityName = (code: string): string => {
    return cities.find(c => c.code === code)?.name || code
  }

  const selectCity = (cityCode: string) => {
    localStorage.setItem('selectedCity', cityCode)
    router.push(`/${cityCode}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-6">
            Pilates
          </h1>
          <p className="text-lg text-gray-500 mb-12">
            Encontre estúdios na sua cidade
          </p>
          
          {/* Detecção de Localização */}
          <button
            onClick={detectLocation}
            disabled={geoLoading}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-16"
          >
            {geoLoading ? (
              <>
                <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Detectando localização...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Usar minha localização
              </>
            )}
          </button>
          
          {userLocation && (
            <p className="text-sm text-gray-500 mb-8">
              Localização: {getCityName(userLocation)}
            </p>
          )}
        </div>

        {/* Lista de Cidades */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4">
            {cities.map((city) => (
              <button
                key={city.code}
                onClick={() => selectCity(city.code)}
                className="text-left py-3 px-1 text-gray-700 hover:text-black transition-all duration-200 border-b border-transparent hover:border-gray-200 cursor-pointer hover:bg-gray-50 rounded-md active:scale-95 active:bg-gray-100"
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center">
          <p className="text-sm text-gray-400">
            Sua cidade não está na lista?{' '}
            <a href="mailto:contato@pilates-brasil.com" className="text-gray-600 hover:text-gray-800">
              Fale conosco
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}