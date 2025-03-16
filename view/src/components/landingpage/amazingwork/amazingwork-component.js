import '../../../styles/landingpage/amazingwork/amazingwork.scss';
import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Button, Card } from 'react-bootstrap';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowRight, BarChart2, Leaf, Activity } from 'lucide-react';

export default function AmazingWork() {
  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState('analytics');
  const [animateIn, setAnimateIn] = useState(false);

  // Sample data for charts
  const analyticsData = [
    { name: 'Jan', value: 400, efficiency: 65 },
    { name: 'Feb', value: 300, efficiency: 59 },
    { name: 'Mar', value: 600, efficiency: 80 },
    { name: 'Apr', value: 780, efficiency: 81 },
    { name: 'May', value: 500, efficiency: 56 },
    { name: 'Jun', value: 820, efficiency: 94 },
    { name: 'Jul', value: 700, efficiency: 76 },
  ];

  const ecoData = [
    { name: 'Project A', value: 700, emissions: -120 },
    { name: 'Project B', value: 420, emissions: -85 },
    { name: 'Project C', value: 380, emissions: -65 },
    { name: 'Project D', value: 510, emissions: -95 },
  ];

  const monitoringData = [
    { name: 'System 1', uptime: 97, issues: 3, status: 'good' },
    { name: 'System 2', uptime: 99, issues: 1, status: 'excellent' },
    { name: 'System 3', uptime: 92, issues: 8, status: 'warning' },
    { name: 'System 4', uptime: 95, issues: 5, status: 'good' },
  ];
  
  const pieData = [
    { name: 'Carbon Reduced', value: 400 },
    { name: 'Energy Saved', value: 300 },
    { name: 'Waste Recycled', value: 300 }
  ];

  // Toggle modal visibility
  const handleShowModal = () => {
    setShowModal(true);
    setTimeout(() => setAnimateIn(true), 100);
  };

  const handleCloseModal = () => {
    setAnimateIn(false);
    setTimeout(() => setShowModal(false), 300);
  };

  // Change active section
  const handleSectionChange = (section) => {
    setAnimateIn(false);
    setTimeout(() => {
      setActiveSection(section);
      setAnimateIn(true);
    }, 300);
  };

  return (
    <Col id="amazingwork" className="text-center py-5">
      <Row id="amazingwork-headerindicationscontainer" className="mb-4">
        <h2 className="amazingwork-subheader text-light">OMSIAP PROJECT</h2>
        <h1 className="amazingwork-header text-white mb-4">Check OMSIAP'S Amazing Work</h1>
        <Button 
          variant="outline-light" 
          size="lg" 
          className="mx-auto mt-3 view-work-btn"
          onClick={handleShowModal}
        >
          View Our Work <ArrowRight className="ml-2" size={20} />
        </Button>
      </Row>

      {/* Preview content before modal is opened */}
      <Col id="amazingwork-contentcontainer" className="preview-container">
        <div className="preview-card analytics">
          <BarChart2 size={60} className="mb-3" />
          <h3>Data Analytics</h3>
        </div>
        <div className="preview-card eco">
          <Leaf size={60} className="mb-3" />
          <h3>Eco-Friendly Projects</h3>
        </div>
        <div className="preview-card monitoring">
          <Activity size={60} className="mb-3" />
          <h3>Monitoring</h3>
        </div>
      </Col>

      {/* Modal for detailed content */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        size="xl" 
        centered
        className="omsiap-modal"
      >
        <Modal.Header closeButton className="border-0 bg-black text-white">
          <Modal.Title className="w-100 text-center">
            <h1 className="modal-title">OMSIAP Innovations</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-black text-white p-0">
          {/* Navigation tabs */}
          <div className="modal-tabs">
            <Button 
              variant={activeSection === 'analytics' ? 'light' : 'outline-light'} 
              onClick={() => handleSectionChange('analytics')}
              className="tab-button"
            >
              <BarChart2 size={20} className="mr-2" /> Data Analytics
            </Button>
            <Button 
              variant={activeSection === 'eco' ? 'light' : 'outline-light'} 
              onClick={() => handleSectionChange('eco')}
              className="tab-button"
            >
              <Leaf size={20} className="mr-2" /> Eco-Friendly Projects
            </Button>
            <Button 
              variant={activeSection === 'monitoring' ? 'light' : 'outline-light'} 
              onClick={() => handleSectionChange('monitoring')}
              className="tab-button"
            >
              <Activity size={20} className="mr-2" /> Monitoring
            </Button>
          </div>

          {/* Content sections */}
          <div className={`content-section ${animateIn ? 'animate-in' : 'animate-out'}`}>
            {activeSection === 'analytics' && (
              <div className="section-content">
                <h2 className="highlight-text mb-4">OMSIAP Data Analytics Platform</h2>
                <p className="lead mb-4">
                  Our advanced analytics platform transforms raw data into actionable insights through cutting-edge 
                  visualization and AI-driven analysis.
                </p>
                
                <Row className="mt-5">
                  <Col md={6}>
                    <Card className="analytics-card mb-4">
                      <Card.Body>
                        <h4 className="mb-3">Performance Metrics</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={analyticsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#fff" />
                            <YAxis stroke="#fff" />
                            <Tooltip contentStyle={{backgroundColor: '#333', border: 'none', color: '#fff'}} />
                            <Legend />
                            <Bar dataKey="value" name="Data Volume" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="analytics-card">
                      <Card.Body>
                        <h4 className="mb-3">Efficiency Trends</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={analyticsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#fff" />
                            <YAxis stroke="#fff" />
                            <Tooltip contentStyle={{backgroundColor: '#333', border: 'none'}} />
                            <Legend />
                            <Line type="monotone" dataKey="efficiency" name="Efficiency %" stroke="#00ff00" activeDot={{ r: 8 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                
                <div className="text-box mt-4">
                  <h3>Core Capabilities</h3>
                  <Row>
                    <Col md={4}>
                      <div className="feature-item">
                        <div className="feature-icon">1</div>
                        <h5>Real-time Processing</h5>
                        <p>Process and visualize data streams with minimal latency</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="feature-item">
                        <div className="feature-icon">2</div>
                        <h5>Predictive Models</h5>
                        <p>AI-driven forecasting with 94% accuracy</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="feature-item">
                        <div className="feature-icon">3</div>
                        <h5>Custom Dashboards</h5>
                        <p>Tailored visualizations for specific business needs</p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            )}

            {activeSection === 'eco' && (
              <div className="section-content">
                <h2 className="highlight-text mb-4">Eco-Friendly Projects</h2>
                <p className="lead mb-4">
                  OMSIAP is committed to sustainability through innovative eco-friendly initiatives that reduce 
                  environmental impact while improving operational efficiency.
                </p>
                
                <Row className="mt-5">
                  <Col md={6}>
                    <Card className="eco-card mb-4">
                      <Card.Body>
                        <h4 className="mb-3">Environmental Impact</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={ecoData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#fff" />
                            <YAxis stroke="#fff" />
                            <Tooltip contentStyle={{backgroundColor: '#333', border: 'none'}} />
                            <Legend />
                            <Area type="monotone" dataKey="emissions" name="CO₂ Reduction (tons)" fill="#4CAF50" stroke="#4CAF50" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="eco-card">
                      <Card.Body>
                        <h4 className="mb-3">Sustainability Metrics</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#4CAF50', '#00BCD4', '#FFC107'][index % 3]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{backgroundColor: '#333', border: 'none'}} />
                          </PieChart>
                        </ResponsiveContainer>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                
                <div className="text-box mt-4">
                  <h3>Featured Initiatives</h3>
                  <Row>
                    <Col md={4}>
                      <div className="eco-project">
                        <div className="eco-icon green">
                          <img src="/api/placeholder/80/80" alt="Smart Energy Grid" />
                        </div>
                        <h5>Smart Energy Grid</h5>
                        <p>AI-optimized energy distribution reducing consumption by 37%</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="eco-project">
                        <div className="eco-icon blue">
                          <img src="/api/placeholder/80/80" alt="Water Conservation System" />
                        </div>
                        <h5>Water Conservation</h5>
                        <p>Intelligent water management system saving 2.4M gallons annually</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="eco-project">
                        <div className="eco-icon amber">
                          <img src="/api/placeholder/80/80" alt="Waste Reduction Program" />
                        </div>
                        <h5>Zero Waste Initiative</h5>
                        <p>Comprehensive recycling program with 94% diversion rate</p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            )}

            {activeSection === 'monitoring' && (
              <div className="section-content">
                <h2 className="highlight-text mb-4">Advanced Monitoring Systems</h2>
                <p className="lead mb-4">
                  Our comprehensive monitoring infrastructure ensures optimal performance across all operations with
                  24/7 surveillance and predictive maintenance capabilities.
                </p>
                
                <Row className="mt-5">
                  <Col md={12}>
                    <Card className="monitoring-card mb-4">
                      <Card.Body>
                        <h4 className="mb-3">System Performance</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={monitoringData} barSize={50}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#fff" />
                            <YAxis stroke="#fff" />
                            <Tooltip contentStyle={{backgroundColor: '#333', border: 'none'}} />
                            <Legend />
                            <Bar dataKey="uptime" name="Uptime %" fill="#00BCD4" />
                            <Bar dataKey="issues" name="Issues Detected" fill="#F44336" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                
                <div className="text-box mt-4">
                  <h3>Monitoring Features</h3>
                  <Row className="monitoring-status">
                    {monitoringData.map((system, index) => (
                      <Col md={3} key={index}>
                        <div className={`status-card ${system.status}`}>
                          <h5>{system.name}</h5>
                          <div className="status-indicator">
                            <div className={`status-light ${system.status}`}></div>
                            <span className="status-text">{system.status.toUpperCase()}</span>
                          </div>
                          <div className="status-details">
                            <p>Uptime: {system.uptime}%</p>
                            <p>Issues: {system.issues}</p>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
                
                <div className="monitoring-features mt-5">
                  <Row>
                    <Col md={4}>
                      <div className="monitor-feature">
                        <div className="monitor-icon">
                          <img src="/api/placeholder/64/64" alt="Real-time Alerts" />
                        </div>
                        <h5>Real-time Alerts</h5>
                        <p>Instant notifications via multiple channels</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="monitor-feature">
                        <div className="monitor-icon">
                          <img src="/api/placeholder/64/64" alt="Predictive Maintenance" />
                        </div>
                        <h5>Predictive Maintenance</h5>
                        <p>AI-driven failure prediction with 89% accuracy</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="monitor-feature">
                        <div className="monitor-icon">
                          <img src="/api/placeholder/64/64" alt="Custom Dashboards" />
                        </div>
                        <h5>Custom Dashboards</h5>
                        <p>Personalized views for different stakeholders</p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </Col>
  );
}