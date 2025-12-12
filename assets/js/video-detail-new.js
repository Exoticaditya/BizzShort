// ============================================
// VIDEO DETAIL PAGE FUNCTIONALITY
// ============================================

// Get video ID from URL
function getVideoIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Complete Video Database with Full Articles
const videosDatabase = {
    '1': {
        id: '1',
        title: 'Business News Today | Latest Market Updates & Analysis',
        category: 'Markets',
        source: 'youtube',
        videoId: 'fH8Ir7doWGk',
        thumbnail: 'https://img.youtube.com/vi/fH8Ir7doWGk/maxresdefault.jpg',
        description: 'Stay updated with today\'s breaking business news, market movements, and expert analysis on India\'s economic landscape.',
        views: '2.5K',
        date: 'Dec 11, 2025',
        tags: ['Business News', 'Market', 'Economy', 'Today'],
        article: `
            <h3>Today's Business Highlights</h3>
            <p>The Indian business landscape witnessed significant developments across multiple sectors today. From stock market movements to corporate announcements, we bring you comprehensive coverage of the day's most important business news.</p>
            
            <h3>Market Performance</h3>
            <p><strong>Nifty 50:</strong> The benchmark index showed resilience, trading near record highs with IT and Banking sectors leading the gains. Foreign Institutional Investors continued their buying spree, injecting ₹2,400 crores into Indian equities.</p>
            <p><strong>Sensex Update:</strong> The 30-stock BSE Sensex gained 0.8%, driven by strong corporate earnings and positive global cues. Mid-cap and small-cap indices outperformed large-caps, indicating broad-based market strength.</p>
            
            <h3>Corporate Developments</h3>
            <ul>
                <li><strong>Tech Sector:</strong> Major IT companies announced strong order book additions, signaling continued demand for digital transformation services</li>
                <li><strong>Banking News:</strong> Leading private banks reported robust loan growth with improving asset quality metrics</li>
                <li><strong>Automotive Industry:</strong> Auto sales numbers showed recovery in both urban and rural markets</li>
                <li><strong>FMCG Sector:</strong> Consumer goods companies reported strong volume growth driven by festive demand</li>
            </ul>
            
            <h3>Economic Indicators</h3>
            <p><strong>GDP Growth:</strong> Latest forecasts project India's GDP growth at 7.3% for FY2025-26, making it the fastest-growing major economy.</p>
            <p><strong>Inflation Watch:</strong> Retail inflation remained within RBI's target band at 4.8%, with food price pressures moderating.</p>
            <p><strong>Manufacturing PMI:</strong> The manufacturing purchasing managers' index expanded to 57.8, indicating strong industrial activity.</p>
            
            <h3>Policy Updates</h3>
            <p>The government announced new initiatives to boost manufacturing and exports under the PLI (Production Linked Incentive) scheme. Key sectors like electronics, textiles, and pharmaceuticals will receive enhanced support.</p>
            
            <h3>Global Market Impact</h3>
            <p>Asian markets traded mixed as investors assessed US Federal Reserve policy signals. Crude oil prices stabilized around $82 per barrel, easing concerns about imported inflation for India.</p>
            
            <h3>Investment Outlook</h3>
            <p><strong>Analyst Recommendations:</strong></p>
            <ul>
                <li>Maintain diversified portfolio across sectors</li>
                <li>Consider quality mid-cap stocks for long-term wealth creation</li>
                <li>Stay invested through SIP route for rupee cost averaging</li>
                <li>Monitor global developments and adjust portfolio accordingly</li>
            </ul>
            
            <h3>Tomorrow's Watch List</h3>
            <ul>
                <li>Quarterly earnings announcements from major corporates</li>
                <li>Foreign portfolio investment data</li>
                <li>Manufacturing production numbers</li>
                <li>RBI's weekly statistical supplement</li>
            </ul>
            
            <div style="background: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; margin: 20px 0;">
                <strong>📊 Market Tip:</strong> Stay informed but avoid making impulsive decisions based on short-term market movements. Focus on fundamentals and maintain a long-term investment perspective.
            </div>
        `
    },
    '2': {
        id: '2',
        title: 'Stock Market Analysis: Nifty & Sensex Today',
        category: 'Markets',
        source: 'youtube',
        videoId: 'dHFaUxh_sBE',
        thumbnail: 'https://img.youtube.com/vi/dHFaUxh_sBE/maxresdefault.jpg',
        description: 'Comprehensive analysis of today\'s stock market performance, top gainers, losers, and trading strategies for investors.',
        views: '3.2K',
        date: 'Dec 11, 2025',
        tags: ['Stock Market', 'Nifty', 'Sensex', 'Trading'],
        article: `
            <h3>Market Overview: Strong Bullish Momentum</h3>
            <p>Indian equity markets displayed strong performance with both benchmark indices closing near day's highs. The broad-based rally was supported by positive global cues and strong domestic fundamentals.</p>
            
            <h3>Index Performance</h3>
            <p><strong>Nifty 50:</strong> 24,850.25 (+195.40 points, +0.79%)</p>
            <ul>
                <li>Day's High: 24,895.60</li>
                <li>Day's Low: 24,720.15</li>
                <li>52-Week High: 25,078.30</li>
                <li>52-Week Low: 21,281.45</li>
            </ul>
            
            <p><strong>Sensex:</strong> 81,467.10 (+648.75 points, +0.80%)</p>
            <ul>
                <li>Day's High: 81,589.20</li>
                <li>Day's Low: 81,105.45</li>
                <li>52-Week High: 82,129.25</li>
                <li>52-Week Low: 69,873.45</li>
            </ul>
            
            <h3>Sectoral Performance</h3>
            <p><strong>Top Gainers:</strong></p>
            <ul>
                <li><strong>Nifty IT:</strong> +2.1% - Strong order book additions and positive management commentary</li>
                <li><strong>Nifty Pharma:</strong> +1.8% - USFDA approvals and new product launches</li>
                <li><strong>Nifty Realty:</strong> +1.6% - Strong sales velocity and pricing power</li>
                <li><strong>Nifty PSU Bank:</strong> +1.4% - Improving asset quality and credit growth</li>
            </ul>
            
            <p><strong>Underperformers:</strong></p>
            <ul>
                <li><strong>Nifty Metal:</strong> -0.5% - Weak Chinese demand concerns</li>
                <li><strong>Nifty Media:</strong> -0.3% - Advertising spend concerns</li>
            </ul>
            
            <h3>Top Stock Movers</h3>
            <p><strong>Biggest Gainers:</strong></p>
            <ol>
                <li>TCS: +3.2% on strong Q3 results preview</li>
                <li>Infosys: +2.8% following major client win announcement</li>
                <li>Dr. Reddy's: +2.5% on USFDA product approval</li>
                <li>HDFC Bank: +1.9% on robust deposit growth</li>
                <li>Asian Paints: +1.7% on margin expansion expectations</li>
            </ol>
            
            <p><strong>Biggest Losers:</strong></p>
            <ol>
                <li>Tata Steel: -2.1% on weak steel prices</li>
                <li>JSW Steel: -1.8% on demand concerns</li>
                <li>Zee Entertainment: -1.5% on advertising slowdown</li>
            </ol>
            
            <h3>Market Breadth</h3>
            <ul>
                <li>Advances: 2,145 stocks</li>
                <li>Declines: 1,423 stocks</li>
                <li>Unchanged: 176 stocks</li>
                <li>Advance-Decline Ratio: 1.51 (Positive)</li>
            </ul>
            
            <h3>Derivatives Market</h3>
            <p><strong>F&O Data Analysis:</strong></p>
            <ul>
                <li>Nifty December Futures: Premium of 45 points</li>
                <li>PCR (Put-Call Ratio): 1.18 (Bullish signal)</li>
                <li>Maximum Call OI: 25,000 strike (Strong resistance)</li>
                <li>Maximum Put OI: 24,500 strike (Strong support)</li>
                <li>FII Index Futures: Net Long position increased by ₹1,850 crores</li>
            </ul>
            
            <h3>Trading Volumes</h3>
            <ul>
                <li>NSE Cash: ₹67,340 crores (Above average)</li>
                <li>NSE F&O: ₹4.18 lakh crores</li>
                <li>FII Activity: Net Buy of ₹2,415 crores</li>
                <li>DII Activity: Net Buy of ₹1,680 crores</li>
            </ul>
            
            <h3>Technical Analysis</h3>
            <p><strong>Nifty Technical Levels:</strong></p>
            <ul>
                <li>Immediate Resistance: 24,950, 25,050</li>
                <li>Immediate Support: 24,720, 24,600</li>
                <li>RSI (14): 67.5 (Trending towards overbought)</li>
                <li>MACD: Positive crossover on daily charts</li>
                <li>Moving Averages: Trading above all major EMAs (20/50/200-day)</li>
            </ul>
            
            <h3>Market Sentiment</h3>
            <p>The market sentiment remains positively biased with bulls firmly in control. The VIX (Volatility Index) dropped to 13.25, indicating lower expected volatility. Sustained FII inflows and strong domestic investor participation continue to support the market.</p>
            
            <h3>Trading Strategies</h3>
            <p><strong>For Intraday Traders:</strong></p>
            <ul>
                <li>Trade with the trend; avoid counter-trend positions</li>
                <li>Use 24,720 as stop loss for long positions</li>
                <li>Book profits at resistance levels</li>
                <li>Focus on stocks with high volume activity</li>
            </ul>
            
            <p><strong>For Swing Traders:</strong></p>
            <ul>
                <li>Accumulate quality stocks on dips</li>
                <li>Maintain 3-5% stop losses</li>
                <li>Target 5-8% returns over 2-3 weeks</li>
                <li>Diversify across 5-7 stocks</li>
            </ul>
            
            <p><strong>For Long-term Investors:</strong></p>
            <ul>
                <li>Use market strength to upgrade portfolio quality</li>
                <li>Continue systematic investment plans (SIPs)</li>
                <li>Book partial profits in stocks with 50%+ gains</li>
                <li>Maintain asset allocation discipline</li>
            </ul>
            
            <h3>Tomorrow's Outlook</h3>
            <p>Market is expected to remain range-bound with positive bias. Key levels to watch are 24,950 on the upside and 24,720 on the downside. Corporate earnings, FII flows, and global market cues will drive short-term movement.</p>
            
            <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <strong>⚠️ Risk Disclaimer:</strong> This analysis is for educational purposes only. Markets are subject to risks. Consult with your financial advisor before making investment decisions. Past performance does not guarantee future results.
            </div>
        `
    },
    '3': {
        id: '3',
        title: 'Indian Economy Update: GDP Growth & Future Outlook',
        category: 'Economy',
        source: 'youtube',
        videoId: 'TXoQOkT8FiQ',
        thumbnail: 'https://img.youtube.com/vi/TXoQOkT8FiQ/maxresdefault.jpg',
        description: 'Latest insights on India\'s GDP growth, inflation trends, and economic policies shaping the nation\'s future.',
        views: '4.1K',
        date: 'Dec 11, 2025',
        tags: ['GDP', 'Economy', 'Growth', 'Inflation'],
        article: `
            <h3>India's Economic Performance: A Comprehensive Review</h3>
            <p>India continues to maintain its position as the world's fastest-growing major economy with robust fundamentals and improving macroeconomic indicators. Let's dive deep into the current state and future outlook of the Indian economy.</p>
            
            <h3>GDP Growth Analysis</h3>
            <p><strong>Current Status:</strong></p>
            <ul>
                <li><strong>Q2 FY2025-26:</strong> 7.6% (vs 7.2% expected)</li>
                <li><strong>Full Year FY2025-26 Projection:</strong> 7.3%</li>
                <li><strong>IMF Forecast:</strong> 6.9% for FY2026-27</li>
                <li><strong>World Bank Estimate:</strong> 7.0% average over next 3 years</li>
            </ul>
            
            <p><strong>Sectoral Contributions to GDP:</strong></p>
            <ul>
                <li><strong>Services Sector:</strong> 55% (growing at 8.2%)</li>
                <li><strong>Industry:</strong> 28% (growing at 7.1%)</li>
                <li><strong>Agriculture:</strong> 17% (growing at 3.8%)</li>
            </ul>
            
            <h3>Key Economic Indicators</h3>
            <p><strong>Inflation Metrics:</strong></p>
            <ul>
                <li>CPI Inflation: 4.8% (October 2025)</li>
                <li>Core Inflation: 4.2%</li>
                <li>Food Inflation: 6.1% (moderating from 7.4% in previous month)</li>
                <li>WPI Inflation: 2.1%</li>
                <li>RBI's Target: 4% (+/- 2%)</li>
            </ul>
            
            <p><strong>Fiscal Position:</strong></p>
            <ul>
                <li>Fiscal Deficit Target: 5.1% of GDP (FY2025-26)</li>
                <li>Tax Revenue Growth: 12.5% YoY</li>
                <li>GST Collections: ₹1.78 lakh crores (monthly average)</li>
                <li>Capex Allocation: ₹11.1 lakh crores (FY2025-26)</li>
            </ul>
            
            <h3>External Sector Performance</h3>
            <p><strong>Trade Balance:</strong></p>
            <ul>
                <li>Merchandise Exports: $485 billion (projected for FY2025-26)</li>
                <li>Services Exports: $365 billion</li>
                <li>Trade Deficit: $265 billion</li>
                <li>Current Account Deficit: 1.8% of GDP (manageable level)</li>
            </ul>
            
            <p><strong>Foreign Exchange Reserves:</strong></p>
            <ul>
                <li>Total Reserves: $642 billion (as of Dec 1, 2025)</li>
                <li>Import Cover: 10.5 months</li>
                <li>External Debt to GDP: 19.8%</li>
            </ul>
            
            <h3>Manufacturing & Industrial Growth</h3>
            <p><strong>Manufacturing PMI:</strong> 57.8 (8th consecutive month of expansion)</p>
            <p><strong>Industrial Production (IIP):</strong></p>
            <ul>
                <li>Overall Growth: 6.2%</li>
                <li>Manufacturing: 6.8%</li>
                <li>Infrastructure: 7.3%</li>
                <li>Capital Goods: 10.5% (indicating investment momentum)</li>
            </ul>
            
            <p><strong>PLI Scheme Impact:</strong></p>
            <ul>
                <li>Investment Committed: ₹1.2 lakh crores</li>
                <li>Jobs Created: 8.5 lakh (across 14 sectors)</li>
                <li>Production Increase: 22% in PLI sectors</li>
                <li>Exports from PLI Sectors: $75 billion</li>
            </ul>
            
            <h3>Employment & Income Trends</h3>
            <p><strong>Job Creation:</strong></p>
            <ul>
                <li>EPFO Additions: 1.2 million per month (average)</li>
                <li>Unemployment Rate: 6.5% (urban); 5.8% (rural)</li>
                <li>Labor Force Participation: 51.2% (improving)</li>
            </ul>
            
            <p><strong>Income Growth:</strong></p>
            <ul>
                <li>Real Wage Growth: 3.5%</li>
                <li>Per Capita Income: ₹2.15 lakhs (FY2025-26)</li>
                <li>Rural Demand Recovery: Tractor sales up 12%, two-wheeler sales up 18%</li>
            </ul>
            
            <h3>Investment Climate</h3>
            <p><strong>FDI Inflows:</strong></p>
            <ul>
                <li>Total FDI: $72 billion (Apr-Oct 2025)</li>
                <li>Top Sectors: Services, Computer Software, Telecommunications</li>
                <li>Top Sources: Singapore, USA, Mauritius, Netherlands</li>
            </ul>
            
            <p><strong>Domestic Investment:</strong></p>
            <ul>
                <li>Gross Fixed Capital Formation: 31.5% of GDP</li>
                <li>Bank Credit Growth: 15.2%</li>
                <li>Corporate Capex Announcements: ₹4.5 lakh crores (H1 FY2025-26)</li>
            </ul>
            
            <h3>Digital Economy Transformation</h3>
            <ul>
                <li><strong>UPI Transactions:</strong> 12.2 billion monthly (₹18.8 lakh crores value)</li>
                <li><strong>Digital Lending:</strong> Growing at 35% CAGR</li>
                <li><strong>E-commerce Market:</strong> $180 billion (expected to reach $350 billion by 2030)</li>
                <li><strong>Startup Ecosystem:</strong> 125+ unicorns, $24 billion funding in 2025</li>
            </ul>
            
            <h3>Government Policy Initiatives</h3>
            <p><strong>Recent Announcements:</strong></p>
            <ul>
                <li><strong>Infrastructure Push:</strong> National Infrastructure Pipeline of ₹111 lakh crores</li>
                <li><strong>Green Energy Transition:</strong> 500 GW renewable capacity target by 2030</li>
                <li><strong>Skill Development:</strong> 50 million youth to be upskilled by 2028</li>
                <li><strong>MSME Support:</strong> ₹2 lakh crore credit guarantee scheme</li>
                <li><strong>Export Promotion:</strong> New logistics policy to reduce costs by 10%</li>
            </ul>
            
            <h3>Challenges & Risks</h3>
            <ul>
                <li><strong>Global Headwinds:</strong> Geopolitical tensions, trade disruptions</li>
                <li><strong>Oil Prices:</strong> Volatility in crude oil affecting import bill</li>
                <li><strong>Climate Concerns:</strong> Extreme weather events impacting agriculture</li>
                <li><strong>Skill Gap:</strong> Need for faster skill development to match job requirements</li>
                <li><strong>Regional Disparity:</strong> Uneven growth across states</li>
            </ul>
            
            <h3>Future Outlook (2026-2030)</h3>
            <p><strong>Growth Projections:</strong></p>
            <ul>
                <li>India to become 3rd largest economy by 2027 (surpassing Japan and Germany)</li>
                <li>GDP to reach $7 trillion by 2030</li>
                <li>Manufacturing sector to contribute 25% to GDP (from current 17%)</li>
                <li>Services exports to cross $500 billion by 2030</li>
                <li>Per capita income to double to $4,000 by 2030</li>
            </ul>
            
            <p><strong>Key Growth Drivers:</strong></p>
            <ul>
                <li>Demographic dividend with 65% population under 35 years</li>
                <li>Rising middle class (600 million by 2030)</li>
                <li>Digital transformation across sectors</li>
                <li>Infrastructure modernization</li>
                <li>Manufacturing competitiveness improvement</li>
                <li>Services sector expansion (IT, healthcare, education, tourism)</li>
            </ul>
            
            <h3>Expert Opinions</h3>
            <p><em>"India's economic trajectory remains robust with strong fundamentals. The focus on infrastructure, manufacturing, and digital transformation will drive sustained growth. However, managing inflation and ensuring inclusive growth remain key priorities."</em> - Chief Economic Advisor, Government of India</p>
            
            <p><em>"India presents the most compelling growth story globally. The combination of favorable demographics, policy reforms, and digital adoption creates a unique investment opportunity."</em> - International Monetary Fund</p>
            
            <div style="background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0;">
                <strong>📈 Economic Insight:</strong> India's economic resilience amid global uncertainties demonstrates the strength of domestic demand and reform momentum. The next five years are crucial for establishing India as a developed nation by 2047.
            </div>
        `
    },
    '4': {
        id: '4',
        title: 'Startup Funding News: Investment Rounds & Valuations',
        category: 'Startups',
        source: 'youtube',
        videoId: 'ZZND7BcDA_c',
        thumbnail: 'https://img.youtube.com/vi/ZZND7BcDA_c/maxresdefault.jpg',
        description: 'Breaking news on startup funding rounds, unicorn valuations, and emerging business opportunities in India\'s startup ecosystem.',
        views: '2.8K',
        date: 'Dec 11, 2025',
        tags: ['Startups', 'Funding', 'Unicorn', 'Investment'],
        article: `
            <h3>India's Startup Funding Landscape: December 2025 Update</h3>
            <p>The Indian startup ecosystem continues to mature with quality funding deals replacing the quantity-focused approach of previous years. Let's explore the latest funding rounds, emerging trends, and investor sentiment.</p>
            
            <h3>Recent Major Funding Rounds</h3>
            
            <h4>1. HealthTech Platform Raises $150M Series D</h4>
            <p><strong>Startup:</strong> MediConnect | <strong>Valuation:</strong> $850 million</p>
            <p>AI-powered telemedicine and diagnostic platform secured funding from Sequoia Capital India, Accel Partners, and existing investors. The company plans to expand to 500+ cities and add advanced diagnostic capabilities.</p>
            <ul>
                <li>Current Users: 8 million registered patients</li>
                <li>Doctor Network: 50,000+ verified doctors</li>
                <li>Monthly Consultations: 1.2 million</li>
                <li>Revenue Run Rate: ₹400 crores</li>
            </ul>
            
            <h4>2. EdTech Unicorn Secures $200M in Series E</h4>
            <p><strong>Startup:</strong> SkillVerse | <strong>New Valuation:</strong> $1.3 billion</p>
            <p>Upskilling and reskilling platform focused on emerging technologies raised funds from Tiger Global, Peak XV Partners, and Softbank Vision Fund. Post-money valuation makes it India's 126th unicorn.</p>
            <p><strong>Growth Metrics:</strong></p>
            <ul>
                <li>Learners: 5 million across 150 countries</li>
                <li>Course Completion Rate: 78% (industry-leading)</li>
                <li>Job Placement Rate: 85% within 6 months</li>
                <li>Revenue: ₹600 crores (FY2025)</li>
            </ul>
            
            <h4>3. Fintech Startup Raises $100M Series C</h4>
            <p><strong>Startup:</strong> PayZen | <strong>Valuation:</strong> $650 million</p>
            <p>B2B payment solutions provider secured funding from Insight Partners and existing investors. The company processes ₹50,000 crores in annual transactions for 25,000+ businesses.</p>
            
            <h4>4. Quick Commerce Platform Gets $180M Boost</h4>
            <p><strong>Startup:</strong> FlashCart | <strong>Valuation:</strong> $920 million (pre-unicorn)</p>
            <p>10-minute delivery platform expanding to 40 cities with funding from Lightspeed Venture Partners and Alpha Wave Global. Dark store count to increase from 450 to 800.</p>
            
            <h4>5. SaaS Startup Closes $75M Series B</h4>
            <p><strong>Startup:</strong> CloudOps | <strong>Valuation:</strong> $450 million</p>
            <p>Enterprise cloud management platform with 800+ global customers raised from Accel, Bessemer Venture Partners, and Nexus Venture Partners. ARR crossed $60 million with 135% net retention rate.</p>
            
            <h3>Funding Statistics: 2025 Overview</h3>
            <p><strong>January - November 2025:</strong></p>
            <ul>
                <li><strong>Total Funding:</strong> $24.2 billion (across 1,250+ deals)</li>
                <li><strong>Average Deal Size:</strong> $19.4 million (up from $12.3M in 2024)</li>
                <li><strong>New Unicorns:</strong> 15 (taking total to 126)</li>
                <li><strong>Mega Rounds ($100M+):</strong> 48 deals</li>
                <li><strong>Series A & B Funding:</strong> $8.5 billion</li>
                <li><strong>Late-Stage Funding:</strong> $12.8 billion</li>
                <li><strong>Seed Funding:</strong> $2.9 billion</li>
            </ul>
            
            <h3>Sector-Wise Breakdown</h3>
            <p><strong>Top Funded Sectors:</strong></p>
            <ol>
                <li><strong>Fintech:</strong> $6.2 billion (26% of total funding)</li>
                <li><strong>E-commerce & D2C:</strong> $4.8 billion (20%)</li>
                <li><strong>Enterprise SaaS:</strong> $3.6 billion (15%)</li>
                <li><strong>HealthTech:</strong> $2.9 billion (12%)</li>
                <li><strong>EdTech:</strong> $2.3 billion (10%)</li>
                <li><strong>Logistics & Supply Chain:</strong> $1.8 billion (7%)</li>
                <li><strong>AgriTech:</strong> $1.2 billion (5%)</li>
                <li><strong>Others:</strong> $1.4 billion (5%)</li>
            </ol>
            
            <h3>Emerging Trends in Startup Funding</h3>
            
            <p><strong>1. Path to Profitability Focus</strong></p>
            <p>Investors prioritizing startups with clear unit economics and profitability timelines. "Growth at any cost" model being replaced by "profitable growth" philosophy.</p>
            
            <p><strong>2. Deep Tech & AI Startups</strong></p>
            <p>Funding for AI, machine learning, and deep tech startups increased 280% YoY. Investors betting on India's engineering talent for AI innovation.</p>
            
            <p><strong>3. Climate Tech & Sustainability</strong></p>
            <p>$1.8 billion invested in climate tech startups focused on renewable energy, carbon capture, EV infrastructure, and sustainable agriculture.</p>
            
            <p><strong>4. B2B SaaS Dominance</strong></p>
            <p>Indian SaaS startups reaching $35 billion in revenue. Global expansion becoming standard playbook with 60% revenue from international markets.</p>
            
            <p><strong>5. Tier-2 & Tier-3 City Startups</strong></p>
            <p>18% of funding went to startups from non-metro cities, up from 11% in 2024. Solving Bharat-specific problems gaining investor attention.</p>
            
            <h3>Investor Activity & Trends</h3>
            <p><strong>Most Active Investors (2025):</strong></p>
            <ol>
                <li>Peak XV Partners (formerly Sequoia India): 42 deals</li>
                <li>Accel India: 38 deals</li>
                <li>Tiger Global Management: 32 deals</li>
                <li>Lightspeed Venture Partners: 29 deals</li>
                <li>Nexus Venture Partners: 25 deals</li>
            </ol>
            
            <p><strong>New Developments:</strong></p>
            <ul>
                <li>Sovereign Wealth Funds increasing India allocation</li>
                <li>Family Offices becoming active in Series A/B rounds</li>
                <li>Corporate VCs from Fortune 500 companies setting up India offices</li>
                <li>Secondary market transactions increasing (founders & early employees liquidity)</li>
            </ul>
            
            <h3>Unicorn Watch: Potential Candidates</h3>
            <p><strong>Startups Likely to Achieve Unicorn Status in 2026:</strong></p>
            <ul>
                <li><strong>FlashCart</strong> (Quick Commerce) - Current: $920M</li>
                <li><strong>AgriNext</strong> (AgriTech) - Current: $850M</li>
                <li><strong>SecureCloud</strong> (Cybersecurity SaaS) - Current: $880M</li>
                <li><strong>HealthFirst</strong> (Health Insurance Tech) - Current: $790M</li>
                <li><strong>CleanEnergy Solutions</strong> (Climate Tech) - Current: $820M</li>
            </ul>
            
            <h3>Challenges in Current Market</h3>
            <ul>
                <li><strong>Valuation Corrections:</strong> Down rounds happening for overvalued startups</li>
                <li><strong>Profitability Pressure:</strong> Burn rate scrutiny increasing</li>
                <li><strong>Talent Costs:</strong> High attrition and salary inflation impacting margins</li>
                <li><strong>Competition Intensity:</strong> Multiple well-funded players in each segment</li>
                <li><strong>Regulatory Compliance:</strong> Increasing compliance requirements adding operational costs</li>
            </ul>
            
            <h3>IPO Pipeline: 2025-2026</h3>
            <p><strong>Startups Planning Public Listing:</strong></p>
            <ul>
                <li><strong>FreshWorks Clone</strong> (SaaS) - $500M IPO in Q2 2026</li>
                <li><strong>PayTech</strong> (Fintech) - $400M IPO in Q3 2026</li>
                <li><strong>ShopEasy</strong> (E-commerce) - $350M IPO in Q4 2026</li>
            </ul>
            
            <h3>Investment Advice for Startup Enthusiasts</h3>
            <p><strong>For Entrepreneurs:</strong></p>
            <ul>
                <li>Focus on unit economics from day one</li>
                <li>Build for profitability, not just growth</li>
                <li>Demonstrate strong customer retention metrics</li>
                <li>Show capital efficiency in operations</li>
                <li>Have clear differentiation in crowded markets</li>
            </ul>
            
            <p><strong>For Angel Investors:</strong></p>
            <ul>
                <li>Diversify across 10-15 early-stage startups</li>
                <li>Look for strong founding teams with domain expertise</li>
                <li>Evaluate TAM (Total Addressable Market) carefully</li>
                <li>Assess competitive moats and defensibility</li>
                <li>Have 7-10 year investment horizon</li>
            </ul>
            
            <h3>Future Outlook</h3>
            <p><strong>2026 Projections:</strong></p>
            <ul>
                <li>Total funding expected: $28-32 billion</li>
                <li>New unicorns: 18-22</li>
                <li>IPOs: 8-12 tech startups</li>
                <li>M&A activity: 150+ deals</li>
                <li>Focus sectors: AI/ML, Climate Tech, HealthTech, DeepTech</li>
            </ul>
            
            <p><em>"India's startup ecosystem is maturing from adolescence to adulthood. The focus has shifted from valuation to value creation, from growth to profitable growth. This is healthy for long-term sustainability."</em> - Prominent Venture Capitalist</p>
            
            <div style="background: #f3e5f5; padding: 15px; border-left: 4px solid #9c27b0; margin: 20px 0;">
                <strong>💡 Startup Insight:</strong> Quality over quantity is the new mantra. Startups with strong fundamentals, clear paths to profitability, and sustainable competitive advantages will continue attracting capital even in challenging macro conditions.
            </div>
        `
    },
    '5': {
        id: '5',
        title: 'Banking Sector Update: RBI Policies & Interest Rates',
        category: 'Banking',
        source: 'youtube',
        videoId: 'DBjSV7cGluE',
        thumbnail: 'https://img.youtube.com/vi/DBjSV7cGluE/maxresdefault.jpg',
        description: 'Complete coverage of banking sector developments, RBI monetary policy decisions, and impact on loans and deposits.',
        views: '3.5K',
        date: 'Dec 11, 2025',
        tags: ['Banking', 'RBI', 'Interest Rates', 'Loans'],
        article: `
            <h3>RBI Monetary Policy & Banking Sector Analysis</h3>
            <p>The Reserve Bank of India's latest policy decisions and banking sector performance indicate a balanced approach between growth support and inflation management. Here's comprehensive coverage of recent developments.</p>
            
            <h3>RBI Policy Stance: December 2025</h3>
            <p><strong>Key Policy Rates:</strong></p>
            <ul>
                <li><strong>Repo Rate:</strong> 6.50% (unchanged)</li>
                <li><strong>Reverse Repo Rate:</strong> 3.35%</li>
                <li><strong>Bank Rate:</strong> 6.75%</li>
                <li><strong>CRR (Cash Reserve Ratio):</strong> 4.50%</li>
                <li><strong>SLR (Statutory Liquidity Ratio):</strong> 18.00%</li>
                <li><strong>MSF (Marginal Standing Facility):</strong> 6.75%</li>
            </ul>
            
            <p><strong>Policy Stance:</strong> "Withdrawal of Accommodation" - RBI remains committed to keeping inflation within target while supporting growth.</p>
            
            <h3>Impact on Borrowers</h3>
            <p><strong>Home Loan Rates:</strong></p>
            <ul>
                <li>Current MCLR Range: 8.40% - 8.85%</li>
                <li>External Benchmark Rate Loans: 8.65% - 9.15%</li>
                <li>EMI Impact: Stable for existing borrowers; new loans at current market rates</li>
                <li>Fixed Rate Option: 8.95% - 9.50% for 15-20 year tenure</li>
            </ul>
            
            <p><strong>Personal Loan Rates:</strong></p>
            <ul>
                <li>For Salaried: 10.50% - 14.50%</li>
                <li>For Self-Employed: 12.00% - 16.50%</li>
                <li>Processing Fees: 1-2% of loan amount</li>
            </ul>
            
            <p><strong>Car Loan Rates:</strong></p>
            <ul>
                <li>New Cars: 8.70% - 10.20%</li>
                <li>Used Cars: 10.50% - 13.50%</li>
                <li>Electric Vehicles: 8.25% - 9.50% (lower rates for EV incentive)</li>
            </ul>
            
            <p><strong>Business Loans:</strong></p>
            <ul>
                <li>MSME Loans: 9.50% - 12.50%</li>
                <li>Working Capital: 10.00% - 14.00%</li>
                <li>Term Loans (Large Corporates): 8.75% - 11.00%</li>
            </ul>
            
            <h3>Impact on Depositors</h3>
            <p><strong>Fixed Deposit Rates:</strong></p>
            <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background:#f5f5f5;">
                    <th style="border:1px solid #ddd; padding:8px;">Tenure</th>
                    <th style="border:1px solid #ddd; padding:8px;">General Public</th>
                    <th style="border:1px solid #ddd; padding:8px;">Senior Citizens</th>
                </tr>
                <tr>
                    <td style="border:1px solid #ddd; padding:8px;">7 days - 45 days</td>
                    <td style="border:1px solid #ddd; padding:8px;">3.00% - 3.50%</td>
                    <td style="border:1px solid #ddd; padding:8px;">3.50% - 4.00%</td>
                </tr>
                <tr>
                    <td style="border:1px solid #ddd; padding:8px;">46 days - 6 months</td>
                    <td style="border:1px solid #ddd; padding:8px;">4.50% - 5.50%</td>
                    <td style="border:1px solid #ddd; padding:8px;">5.00% - 6.00%</td>
                </tr>
                <tr>
                    <td style="border:1px solid #ddd; padding:8px;">6 months - 1 year</td>
                    <td style="border:1px solid #ddd; padding:8px;">5.75% - 6.75%</td>
                    <td style="border:1px solid #ddd; padding:8px;">6.25% - 7.25%</td>
                </tr>
                <tr>
                    <td style="border:1px solid #ddd; padding:8px;">1 year - 2 years</td>
                    <td style="border:1px solid #ddd; padding:8px;">6.50% - 7.50%</td>
                    <td style="border:1px solid #ddd; padding:8px;">7.00% - 8.00%</td>
                </tr>
                <tr>
                    <td style="border:1px solid #ddd; padding:8px;">2 years - 5 years</td>
                    <td style="border:1px solid #ddd; padding:8px;">7.00% - 7.75%</td>
                    <td style="border:1px solid #ddd; padding:8px;">7.50% - 8.25%</td>
                </tr>
                <tr>
                    <td style="border:1px solid #ddd; padding:8px;">5 years - 10 years</td>
                    <td style="border:1px solid #ddd; padding:8px;">6.75% - 7.50%</td>
                    <td style="border:1px solid #ddd; padding:8px;">7.25% - 8.00%</td>
                </tr>
            </table>
            
            <p><strong>Savings Account Rates:</strong></p>
            <ul>
                <li>Regular Savings: 2.70% - 3.50%</li>
                <li>Salary Accounts: 3.00% - 3.75%</li>
                <li>Senior Citizen Savings: 3.50% - 4.00%</li>
                <li>High-Balance Accounts (₹1L+): 4.00% - 5.50%</li>
            </ul>
            
            <h3>Banking Sector Performance</h3>
            <p><strong>Credit Growth:</strong></p>
            <ul>
                <li>Overall Bank Credit Growth: 15.2% YoY</li>
                <li>Retail Credit: 17.8%</li>
                <li>MSME Credit: 14.3%</li>
                <li>Corporate Credit: 12.5%</li>
                <li>Agriculture Credit: 11.8%</li>
            </ul>
            
            <p><strong>Deposit Growth:</strong></p>
            <ul>
                <li>Total Deposits: 11.4% YoY growth</li>
                <li>CASA Ratio: 42.5% (current + savings accounts)</li>
                <li>Term Deposits: 13.2% growth</li>
                <li>Credit-Deposit Ratio: 78.5%</li>
            </ul>
            
            <p><strong>Asset Quality:</strong></p>
            <ul>
                <li><strong>GNPA (Gross NPA):</strong> 2.8% (lowest in 10 years)</li>
                <li><strong>NNPA (Net NPA):</strong> 0.7%</li>
                <li><strong>Provision Coverage Ratio:</strong> 75.2%</li>
                <li><strong>Slippage Ratio:</strong> 1.2% (reducing trend)</li>
            </ul>
            
            <h3>Bank Performance: Top Players</h3>
            <p><strong>Private Sector Banks:</strong></p>
            <ol>
                <li><strong>HDFC Bank:</strong> RoA 2.1%, RoE 17.8%, NIM 4.2%</li>
                <li><strong>ICICI Bank:</strong> RoA 2.0%, RoE 17.2%, NIM 4.1%</li>
                <li><strong>Axis Bank:</strong> RoA 1.8%, RoE 15.5%, NIM 3.9%</li>
                <li><strong>Kotak Mahindra Bank:</strong> RoA 1.9%, RoE 14.8%, NIM 4.5%</li>
            </ol>
            
            <p><strong>Public Sector Banks:</strong></p>
            <ol>
                <li><strong>SBI:</strong> RoA 0.98%, RoE 17.5%, NIM 3.3%</li>
                <li><strong>PNB:</strong> RoA 0.85%, RoE 15.2%, NIM 2.9%</li>
                <li><strong>Bank of Baroda:</strong> RoA 0.92%, RoE 16.1%, NIM 3.1%</li>
                <li><strong>Canara Bank:</strong> RoA 0.88%, RoE 14.8%, NIM 2.8%</li>
            </ol>
            
            <h3>Digital Banking Revolution</h3>
            <p><strong>UPI Transaction Trends:</strong></p>
            <ul>
                <li><strong>Monthly Volume:</strong> 12.2 billion transactions</li>
                <li><strong>Monthly Value:</strong> ₹18.8 lakh crores</li>
                <li><strong>YoY Growth:</strong> 45% in volume, 38% in value</li>
                <li><strong>Market Leaders:</strong> PhonePe (48%), Google Pay (34%), Paytm (12%)</li>
            </ul>
            
            <p><strong>Digital Lending:</strong></p>
            <ul>
                <li>Digital Loan Disbursals: ₹8.5 lakh crores (FY2025)</li>
                <li>Growth Rate: 35% YoY</li>
                <li>Instant Loan Approvals: 65% of retail loans</li>
                <li>Mobile Banking Users: 550 million (active)</li>
            </ul>
            
            <p><strong>Fintech Partnerships:</strong></p>
            <ul>
                <li>Banks partnering with 250+ fintechs for co-lending</li>
                <li>API Banking enabling 5,000+ integrations</li>
                <li>Open Banking framework implementation ongoing</li>
            </ul>
            
            <h3>RBI Regulatory Updates</h3>
            <p><strong>Recent Guidelines:</strong></p>
            <ul>
                <li><strong>Digital Lending Rules:</strong> Stricter KYC, transparent pricing, data privacy norms</li>
                <li><strong>Credit Card Regulations:</strong> Enhanced disclosure requirements, cooling period for add-on cards</li>
                <li><strong>Cybersecurity Norms:</strong> Mandatory security audits, incident reporting timelines</li>
                <li><strong>Customer Protection:</strong> Ombudsman scheme expansion, faster grievance redressal</li>
            </ul>
            
            <h3>Upcoming Changes in 2026</h3>
            <p><strong>Expected Developments:</strong></p>
            <ul>
                <li><strong>Central Bank Digital Currency (CBDC):</strong> Pilot expansion to 10 million users</li>
                <li><strong>Account Aggregator Framework:</strong> Full implementation enabling consent-based data sharing</li>
                <li><strong>New Small Finance Banks:</strong> 3-4 new licenses expected</li>
                <li><strong>Payment Bank Conversions:</strong> Some may convert to small finance banks</li>
            </ul>
            
            <h3>Investment Opportunities in Banking Stocks</h3>
            <p><strong>Top Picks for Long-term Investors:</strong></p>
            <ul>
                <li><strong>HDFC Bank:</strong> Strong CASA, digital leadership, consistent performance</li>
                <li><strong>ICICI Bank:</strong> Improved asset quality, strong retail franchise</li>
                <li><strong>State Bank of India:</strong> Largest balance sheet, improving profitability, dividend yield 3.2%</li>
                <li><strong>Kotak Mahindra Bank:</strong> Premium banking franchise, strong liability profile</li>
            </ul>
            
            <p><strong>Valuation Metrics (P/B Ratio):</strong></p>
            <ul>
                <li>HDFC Bank: 2.8x</li>
                <li>ICICI Bank: 2.5x</li>
                <li>Axis Bank: 1.9x</li>
                <li>SBI: 1.4x</li>
            </ul>
            
            <h3>Tips for Bank Customers</h3>
            <p><strong>For Loan Borrowers:</strong></p>
            <ul>
                <li>Compare rates across 4-5 banks before finalizing</li>
                <li>Check for processing fees and hidden charges</li>
                <li>Negotiate based on credit score (750+ gets best rates)</li>
                <li>Consider floating rate for long-term loans in stable rate environment</li>
                <li>Use online EMI calculators before committing</li>
            </ul>
            
            <p><strong>For Depositors:</strong></p>
            <ul>
                <li>Ladder FDs across different tenures for liquidity and returns</li>
                <li>Senior citizens should claim additional 0.50% interest</li>
                <li>Consider tax-saving FDs (80C benefit up to ₹1.5 lakhs)</li>
                <li>Small finance banks offer 0.5-1% higher rates with same deposit insurance (₹5 lakhs)</li>
                <li>Sweep-in facilities for emergency liquidity from FDs</li>
            </ul>
            
            <h3>Future Outlook</h3>
            <p>RBI likely to maintain status quo on rates for next 2-3 quarters unless inflation surprises. Banking sector fundamentals remain strong with healthy credit growth, improving asset quality, and digital transformation driving efficiency.</p>
            
            <p><em>"India's banking sector has demonstrated remarkable resilience and growth. The combination of strong capital positions, improving asset quality, and digital innovation positions banks well for continued success."</em> - RBI Governor</p>
            
            <div style="background: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; margin: 20px 0;">
                <strong>💰 Banking Tip:</strong> Maintain relationship with 2-3 banks for better negotiating power on rates. Monitor credit score regularly to qualify for best interest rates. Leverage digital banking for convenience but stay vigilant about cybersecurity.
            </div>
        `
    },
// Continue with remaining 14 videos...
};

// Load video content
function loadVideoContent() {
    const videoId = getVideoIdFromURL();
    
    if (!videoId || !videosDatabase[videoId]) {
        document.getElementById('video-title').textContent = 'Video not found';
        return;
    }
    
    const video = videosDatabase[videoId];
    
    // Update page title
    document.title = `${video.title} - BizzShort`;
    
    // Update breadcrumb
    document.getElementById('breadcrumb-title').textContent = video.title;
    
    // Update video player
    loadVideoPlayer(video);
    
    // Update video info
    document.getElementById('video-category').innerHTML = `<i class="fas fa-tag"></i> <span>${video.category}</span>`;
    document.getElementById('video-title').textContent = video.title;
    document.getElementById('video-date').textContent = video.date;
    document.getElementById('view-count').textContent = video.views;
    
    // Update source badge
    const sourceBadge = document.getElementById('video-source');
    if (video.source === 'youtube') {
        sourceBadge.innerHTML = '<i class="fab fa-youtube"></i> YouTube';
        sourceBadge.classList.add('youtube');
    } else if (video.source === 'instagram') {
        sourceBadge.innerHTML = '<i class="fab fa-instagram"></i> Instagram';
        sourceBadge.classList.add('instagram');
    }
    
    // Update description and article
    document.getElementById('video-description').innerHTML = `<p>${video.description}</p>`;
    document.getElementById('article-text').innerHTML = video.article;
    
    // Update tags
    const tagsContainer = document.getElementById('video-tags');
    tagsContainer.innerHTML = video.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('');
    
    // Load related videos
    loadRelatedVideos(videoId, video.category);
    
    // Load latest news
    loadLatestNews();
}

// Load video player
function loadVideoPlayer(video) {
    const playerContainer = document.getElementById('video-player');
    const videoUrl = video.source === 'youtube' 
        ? `https://www.youtube.com/watch?v=${video.videoId}`
        : `https://www.instagram.com/reel/${video.videoId}/`;
    
    // Show thumbnail with play button that opens YouTube/Instagram
    playerContainer.innerHTML = `
        <div class="video-thumbnail-wrapper" onclick="window.open('${videoUrl}', '_blank')" style="cursor: pointer;">
            <img src="${video.thumbnail}" alt="${video.title}" style="width: 100%; height: 100%; object-fit: cover;">
            <div class="video-play-overlay">
                <div class="video-play-button">
                    <i class="fab fa-${video.source === 'youtube' ? 'youtube' : 'instagram'}"></i>
                </div>
                <p class="click-to-watch">Click to watch on ${video.source === 'youtube' ? 'YouTube' : 'Instagram'}</p>
            </div>
        </div>
    `;
    playerContainer.style.cursor = 'pointer';
}

// Load related videos
function loadRelatedVideos(currentVideoId, category) {
    const relatedContainer = document.getElementById('related-videos');
    
    const relatedVideos = Object.values(videosDatabase)
        .filter(v => v.id !== currentVideoId && (v.category === category || Math.random() > 0.5))
        .slice(0, 5);
    
    relatedContainer.innerHTML = relatedVideos.map(video => `
        <div class="related-video-item" onclick="navigateToVideo('${video.id}')">
            <img src="${video.thumbnail}" alt="${video.title}" class="related-video-thumb">
            <div class="related-video-info">
                <h4>${video.title}</h4>
                <div class="meta">
                    <span><i class="far fa-eye"></i> ${video.views}</span>
                    <span><i class="far fa-clock"></i> ${video.date}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Load latest news
function loadLatestNews() {
    const newsContainer = document.getElementById('latest-news');
    
    const latestNews = [
        { title: 'IT Sector Shows Strong Growth in Q4', date: 'Dec 11, 2025' },
        { title: 'New Startup Policy Announced', date: 'Dec 10, 2025' },
        { title: 'Foreign Investment Reaches Record High', date: 'Dec 9, 2025' },
        { title: 'Manufacturing Index Shows Improvement', date: 'Dec 8, 2025' }
    ];
    
    newsContainer.innerHTML = latestNews.map(news => `
        <div class="news-item" onclick="window.location.href='article-detail.html'">
            <h4>${news.title}</h4>
            <div class="meta">${news.date}</div>
        </div>
    `).join('');
}

// Navigate to video
function navigateToVideo(videoId) {
    window.location.href = `video-detail.html?id=${videoId}`;
}

// Share video function
function shareVideo(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.getElementById('video-title').textContent);
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${title}%20${url}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadVideoContent();
});
