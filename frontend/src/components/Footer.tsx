export function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Sobre Nós</h3>
                        <p className="text-gray-300">
                            Sua loja online de confiança com os melhores produtos
                            e atendimento excepcional.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>Política de Privacidade</li>
                            <li>Termos de Uso</li>
                            <li>FAQ</li>
                            <li>Suporte</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contato</h3>
                        <div className="text-gray-300">
                            <p>Email: contato@loja.com</p>
                            <p>Telefone: (11) 1234-5678</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
                    © 2024 Loja. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    );
}