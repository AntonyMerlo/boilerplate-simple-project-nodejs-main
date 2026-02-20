#!/bin/bash

# Script para testar tudo localmente (simula o CI do GitHub)

set -e

echo "🔍 Iniciando testes locais..."
echo ""

services=("auth-service" "user-service" "restaurant-service")

for service in "${services[@]}"; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📦 Testando: $service"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  cd "$service"
  
  # Instalar dependências se necessário
  if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependências..."
    npm install
  fi
  
  # Rodar lint
  echo "🔧 Rodando ESLint..."
  npm run lint
  
  # Rodar testes
  echo "✅ Rodando testes..."
  npm test -- --passWithNoTests
  
  cd ..
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Todos os testes passaram! Seguro fazer push."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
