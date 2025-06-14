import Image from "next/image";
import Link from "next/link";

import clsx from "clsx";
import s from "./style.module.scss"

export function Footer() {
  return (
    <div className={ s.footer }>
      <div className={ s.logo }>
        <Image
          src="/logo/logo--white.png"
          alt="Logo"
          width={ 335 }
          height={ 64 }
        />
      </div>

      <div className={ s.content }>
        <div className={ s.links }>
          <div className={ clsx(s.column, s.routes) }>
            <Link
              className={ s.link }
              href="/"
            > Início
            </Link>
            
            <Link
              className={ s.link }
              href="/cliente/login"
            > Login
            </Link>

            <Link
              className={ s.link }
              href="/categorias"
            > Categorias
            </Link>
            
            <Link
              className={ s.link }
              href="/cliente"
            > Área do Cliente
            </Link>
            
            <Link
              className={ s.link }
              href="/recuperar-senha"
            > Recuperar Senha
            </Link>
            
            <Link
              className={ s.link }
              href="/duvidas-frequentes"
            > Dúvidas Frequentes
            </Link>
          </div>

          <div className={ clsx(s.column, s.docs) }>
          <Link
              className={ s.link }
              href="/suporte"
            > Suporte
            </Link>
            
            <Link
              className={ s.link }
              href="/fornecedor/cadastro"
            > Seja um Fornecedor
            </Link>

            <Link
              className={ s.link }
              href="/termos-de-uso"
            > Termos de Uso
            </Link>
            
            <Link
              className={ s.link }
              href="/politicas-de-imagem"
            > Políticas de Imagem
            </Link>
          </div>

          <div className={ clsx(s.column, s.socials) }>
            <Link
              className={ s.link }
              href="/seja-fornecedor"
            > Seja um Fornecedor
            </Link>

            <Link
              className={ s.link }
              href="/termos-de-uso"
            > Termos de Uso
            </Link>
            
            <Link
              className={ s.link }
              href="/politicas-de-imagem"
            > Políticas de Imagem
            </Link>
          </div>
        </div>

        <div className={ s.info }>
          <div className={ clsx(s.item, s.service) }>
            <span>Atendimento</span>
            <strong>Telefone e Chat:</strong>
            <span>Segunda a Sexta, 09h às 18h.</span>
          </div>

          <div className={ clsx(s.item, s.service) }>
            <span>Suporte</span>
            <strong>&#40;17&#41; 98765-4321</strong>
            <span>Segunda a Sexta, 08h às 19h.</span>
          </div>

          <div className={ s.logo }>
            
          </div>
        </div>
      </div>

      <div className={ s.copyright }>
         <span>&#169; 2025 - <strong>EmCliques</strong>: Todos os direitos reservados</span>
         <span>CNPJ: 10.000.000/0001-00</span>
      </div>
    </div>
  )
}