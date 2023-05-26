import { useEffect, useState } from 'react';
import './App.css';
import Chart from 'react-apexcharts';
import styles from './App.module.scss';
import marcas from './data/marca.json';
import produtos from './data/produto.json';
import categorias from './data/categoria.json';

function App() {
  const [selectedCategoria, setSelectedCategoria] = useState<string>('Automotivo');
  const [selectedProduto, setSelectedProduto] = useState<string>('Carro');
  const [selectedMarca, setSelectedMarca] = useState<string>('Volkswagen');

  return (
    <div>
      <div className={styles.headerMenu}>
        <span className={styles.item}>Menu</span>
        <span className={`${styles.item} ${styles.title}`}>Sales Report</span>
        <span className={styles.item}>Ericca Rickli</span>        
      </div>
      <Options 
        selectedProduto={selectedProduto}
        selectedCategoria={selectedCategoria} 
        setSelectedMarca={setSelectedMarca}
        setSelectedProduto={setSelectedProduto}
        setSelectedCategoria={setSelectedCategoria}
      />
      <div className={styles.titleContainer}>
        <span className={styles.salesTitle}>Sales By Month for:</span>
        <SalesChart brand={selectedMarca} />
      </div>
    </div>
  );
}

interface OptionsProps {
  selectedProduto: string;
  selectedCategoria: string;
  setSelectedMarca: (marca: string) => void;
  setSelectedProduto: (produto: string) => void;
  setSelectedCategoria: (categoria: string) => void;
}

function Options({
  selectedProduto,
  selectedCategoria,
  setSelectedMarca,
  setSelectedProduto,
  setSelectedCategoria,
}: OptionsProps) {
  const handleOnCategoriaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoria = event.target.value;
    setSelectedCategoria(categoria);
    setSelectedProduto(Object.values(produtos).find((produto) => produto.categoria === categoria)?.nome || '');
    setSelectedMarca(Object.values(marcas).find((marca) => marca.categoria === categoria)?.nome || '');
  }

  const handleOnProdutoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const produto = event.target.value;
    setSelectedProduto(produto);
    setSelectedMarca(Object.values(marcas).find((marca) => marca.produto === produto)?.nome || '');
  }

  return (
    <div className={styles.optionsContainer}>
        <div className={styles.options}>
          <div className={styles.selectContainer}>
              <span>Categoria:</span>
              <select 
                onChange={handleOnCategoriaChange} 
                className={styles.select} 
                name='categoria'
              >
                { Object.values(categorias).map((categoria) => {
                    return (
                      <option
                        selected={categoria.nome === selectedCategoria}
                        value={categoria.nome}
                      >
                        {categoria.nome}
                      </option>
                    );
                }) }
              </select>   
            </div>
          
          <div className={styles.selectContainer}>
            <span>Produto:</span>
            <select 
              onChange={handleOnProdutoChange} 
              className={styles.select} 
              name='produto'
            >
              { Object.values(produtos).map((produto) => 
                produto.categoria === selectedCategoria 
                && <option value={produto.nome}>{produto.nome}</option>
              ) }
            </select>   
          </div>
          <div className={styles.selectContainer}>
            <span>Marca:</span>
            <select 
              onChange={(event) => setSelectedMarca(event.target.value)}  
              className={styles.select} 
              name='marca'
            >
              { Object.values(marcas).map((marca) => 
                  marca.produto === selectedProduto && marca.categoria === selectedCategoria 
                  && <option value={marca.nome}>{marca.nome}</option>
              ) }
            </select>   
          </div>
        </div>
      </div>
  );
}

interface SalesChartProps {
  brand: string;
}

function SalesChart({ brand }: SalesChartProps) {
  const [sales, setSales] = useState<{ [month: string]: number }>();
  useEffect(() => setSales(Object.values(marcas).find((marca) => marca.nome === brand)?.sales) , [brand]);

  const state = {
    options: {
      chart: {
        id: 'sales-chart',
      },
      xaxis: {
        categories: Object.keys(sales || '')
      }
    },
    series: [
      {
        name: '',
        data: Object.values(sales || ''),
      }
    ]
  };

  return (
      <div>
        <Chart
          options={state.options}
          series={state.series}
          type='bar'
          width='800'
        />
      </div>
  );
}


export default App;
