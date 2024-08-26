import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import Modal from 'react-modal';

import { data } from '../data/data';
import { events } from '../data/events';

const EconomicCrisisTimeline = () => {
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (!data || data.length === 0) {
      console.error("Data is not loaded correctly.");
      return;
    }

    const sampledData = sampleWeeklyData(data);
    const categories = sampledData.map(item => item.Date);
    
    const seriesData = [
      { name: "S&P 500", data: sampledData.map(item => item['^spx_d']), color: '#FF4560' },
      { name: "Shanghai Composite", data: sampledData.map(item => item['^shc_d']), color: '#008FFB' },
      { name: "Hang Seng Index", data: sampledData.map(item => item['^hsi_d']), color: '#00E396' },
      { name: "NASDAQ", data: sampledData.map(item => item['^ndq_d']), color: '#FEB019' },
      { name: "Dow Jones Industrial Average", data: sampledData.map(item => item['^dji_d']), color: '#775DD0' },
      { name: "Nikkei 225", data: sampledData.map(item => item['^nkx_d']), color: '#FF66C3' }
    ];

    setSeries(seriesData);

    const initialOptions = {
      chart: {
        type: 'line',
        zoom: { 
          enabled: true, 
          type: 'x',
          autoScaleYaxis: true
        },
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
      },
      xaxis: {
        categories: categories,
        type: 'datetime',
        labels: {
          rotate: -45,
          rotateAlways: true,
          formatter: (value) => new Date(value).toLocaleDateString()
        },
        crosshairs: {
          show: true,
          width: 1,
          position: 'back',
          opacity: 0.9,
          stroke: {
            color: '#b6b6b6',
            width: 1,
            dashArray: 3,
          },
        }
      },
      yaxis: {
        title: { text: 'Index Value' },
        labels: { 
          formatter: (value) => value === null ? 'N/A' : value.toFixed(2)
        }
      },
      stroke: { curve: 'smooth', width: 2 },
      tooltip: { 
        enabled: true,
        shared: true,
        followCursor: true,
        x: { format: 'dd MMM yyyy' },
        y: {
          formatter: (value) => value === null ? 'N/A' : value.toFixed(2)
        }
      },
      legend: { position: 'top' },
      annotations: {
        xaxis: getEventAnnotations(categories) // 이벤트 라벨을 차트에 추가
      }
    };
    

    setOptions(initialOptions);
  }, []);

  const sampleWeeklyData = (data) => {
    const weeklyData = [];
    for (let i = 0; i < data.length; i += 7) {
      weeklyData.push(data[i]);
    }
    return weeklyData;
  };

  const getEventAnnotations = (categories) => {
    return events.map(event => ({
      x: new Date(event.date).getTime(),
      borderColor: '#FF4560',
      label: {
        borderColor: '#FF4560',
        style: {
          color: '#fff',
          background: '#FF4560',
          fontSize: '12px',
          padding: {
            left: 10,
            right: 10,
            top: 2,
            bottom: 2,
          },
          borderRadius: 3,
        },
        text: event.name,
        orientation: 'horizontal', // 라벨을 수평으로 표시
        offsetY: -10, // 라벨의 y 위치를 조정하여 겹치지 않도록 함
      }
    })).filter(event => 
      new Date(categories[0]) <= new Date(event.x) && new Date(event.x) <= new Date(categories[categories.length - 1])
    );
  };
  

  const openModal = (event) => {
    setSelectedEvent(event);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div>
      <h2>Economic Crisis Timeline (Weekly Data)</h2>
      {series.length > 0 && (
        <ReactApexChart 
          options={options} 
          series={series} 
          type="line" 
          height={600} 
        />
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Major Economic Events:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {events.map((event, index) => (
            <div 
              key={index} 
              style={{ 
                background: '#f0f0f0', 
                padding: '10px', 
                borderRadius: '5px', 
                cursor: 'pointer', 
                width: '30%',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' 
              }}
              onClick={() => openModal(event)}
            >
              <strong>{event.date}:</strong> {event.name}
            </div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={closeModal} 
        contentLabel="Event Details"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
          }
        }}
      >
        {selectedEvent && (
          <div>
            <h2>{selectedEvent.name}</h2>
            <p><strong>Date:</strong> {selectedEvent.date}</p>
            <p>{selectedEvent.description}</p>
            <button onClick={closeModal} style={{ marginTop: '20px' }}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EconomicCrisisTimeline;
