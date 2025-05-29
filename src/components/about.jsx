import React from 'react'
import {Drawer,DrawerClose,DrawerContent,DrawerDescription,DrawerFooter,DrawerHeader,DrawerTitle,DrawerTrigger,} from "@/components/ui/drawer"
import {Button} from '@/components/ui/button'

export default function About() {
    return (
      <Drawer>
        <DrawerTrigger className='text-gray-700 dark:text-gray-300 hover:text-gray-900 
                                dark:hover:text-white transition-colors cursor-pointer'>Sobre Nosotros</DrawerTrigger>
        <DrawerContent className="bg-slate-200">
          <DrawerHeader>
            <DrawerTitle>¿Quienes somos?</DrawerTitle>
            <DrawerDescription>Aprende sobre quienes somos, que hacemos y cual es nuestra misión.</DrawerDescription>
            <DrawerClose asChild>
              <button
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
                aria-label="Close"
              >
                <svg
                  className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </DrawerClose>
          </DrawerHeader>
          <div className="p-6 overflow-y-auto flex-grow">
            <section className="container mx-auto">
              <div className="max-w-4xl mx-auto rounded-lg overflow-hidden md:flex flex-col md:flex-row">
                {/* Content Section */}
                <div className="w-full p-8 flex flex-col items-start">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Dejanos contarte sobre nosotros
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  ¡Bienvenido a VitaUNEFA! Somos tu compañero digital que monitorea los cambios climaticos.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    En un mundo que necesita urgentemente nuestra atención, creemos firmemente que la educación y la acción son las claves para generar un cambio significativo. VitaUNEFA nace con la misión de empoderar a los estudiantes para que comprendan y reduzcan su impacto ambiental diario. 
                    Nuestra aplicación es inteligente y está diseñada para ti. Consume datos de APIs de terceros para ofrecerte sugerencias y recomendaciones 
                    personalizadas que realmente te ayuden a vivir de forma más sostenible y a enfrentar el día a día. ¿Te preguntas si debes llevar paraguas hoy para evitar un taxi o qué ruta es más ecológica para tu universidad? 
                    ¿Necesitas saber si vale la pena llevar tu termo de agua para rellenar en el campus? Nuestra app te lo dirá, ayudándote a tomar decisiones conscientes que benefician al planeta y a tu rutina.
                    Pero no nos quedamos solo en las recomendaciones. Nos importa cómo te sientes y cómo estas sugerencias impactan en tu vida. Por eso, recibimos tu feedback sobre la efectividad y la viabilidad de cada recomendación. 
                    Esto nos permite aprender y ajustar nuestras sugerencias, asegurando que sean prácticas, útiles y se adapten a la realidad de tu día a día como estudiante.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </DrawerContent>
      </Drawer>

    );
  };