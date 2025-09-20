interface FubConfig {
  apiKey: string;
  systemName: string;
  systemKey: string;
  baseUrl: string;
}

interface FubPerson {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  type?: string;
}

interface FubNote {
  id: number;
  body: string;
  userId?: number;
  dealId?: number;
  personId?: number;
}

interface FubDeal {
  id: number;
  name: string;
  stage?: string;
  status?: string;
  type?: string;
  listingType?: string;
  personId?: number;
  agentId?: number;
}

export class FubClient {
  private config: FubConfig;

  constructor() {
    this.config = {
      apiKey: process.env.FUB_API_KEY || '',
      systemName: process.env.FUB_SYSTEM_NAME || '',
      systemKey: process.env.FUB_SYSTEM_KEY || '',
      baseUrl: 'https://api.followupboss.com/v1'
    };
  }

  private getHeaders() {
    const auth = Buffer.from(`${this.config.apiKey}:`).toString('base64');
    return {
      'Authorization': `Basic ${auth}`,
      'X-System': this.config.systemName,
      'X-System-Key': this.config.systemKey,
      'Content-Type': 'application/json'
    };
  }

  async getAgents(): Promise<FubPerson[]> {
    const response = await fetch(`${this.config.baseUrl}/users`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`FUB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const users = data.users || [];
    
    return users.map((user: any) => ({
      id: user.id,
      firstName: user.firstName || (user.name ? user.name.split(' ')[0] : ''),
      lastName: user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : ''),
      email: user.email,
      type: user.type
    }));
  }

  async getDeals(filters: {
    buyerOrSeller?: 'buyer' | 'seller';
    transactionType?: 'bba' | 'la' | 'uc';
    agentId?: number;
  } = {}): Promise<FubDeal[]> {
    const response = await fetch(`${this.config.baseUrl}/deals/?userId=${filters.agentId}`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`FUB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let deals = data.deals || [];
    return deals;
    
    // Client-side filtering based on conditional logic
    if (filters.buyerOrSeller && filters.transactionType) {
      deals = this.filterDealsByConditions(deals, filters.buyerOrSeller, filters.transactionType);
    }
    
    return deals;
  }

  private filterDealsByConditions(
    deals: FubDeal[], 
    buyerOrSeller: 'buyer' | 'seller', 
    transactionType: 'bba' | 'la' | 'uc'
  ): FubDeal[] {
    // Define stage mapping for conditional logic
    const stageMapping = {
      // Buyer conditions
      'buyer-bba': ['Buyer Application', 'Application', 'Lead'],
      'buyer-uc': ['Buyer Application', 'Application', 'BBA', 'Under Contract', 'Lead'],
      
      // Seller conditions  
      'seller-la': ['Seller Application', 'Application', 'Lead'],
      'seller-uc': ['Seller Application', 'Application', 'LA', 'Listing Agreement', 'Under Contract', 'Lead']
    };

    const key = `${buyerOrSeller}-${transactionType}` as keyof typeof stageMapping;
    const allowedStages = stageMapping[key] || [];
    
    return deals.filter((deal: any) => {
      const dealStage = deal.stage || deal.status || '';
      const dealName = deal.name || '';
      
      // Filter by stage/status or deal name containing relevant keywords
      return allowedStages.some(stage => 
        dealStage.toLowerCase().includes(stage.toLowerCase()) ||
        dealName.toLowerCase().includes(stage.toLowerCase())
      );
    });
  }

  async createEvent(eventData: {
    source: string;
    type: string;
    message?: string;
    dealId?: string;
    agentId?: string;
    person: {
      firstName: string;
      lastName: string;
      email?: string;
      phone?: string;
    };
  }) {
    const payload: any = {
      ...eventData,
      system: this.config.systemName
    };

    // Include deal reference if provided
    if (eventData.dealId) {
      payload.dealId = parseInt(eventData.dealId);
    }

    // Include agent assignment if provided
    if (eventData.agentId) {
      payload.assignedTo = parseInt(eventData.agentId);
    }

    const response = await fetch(`${this.config.baseUrl}/events`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`FUB API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async addDealNote(dealId: string, note: string, agentId?: string) {
    const payload: any = {
      body: note,
      source: this.config.systemName
    };

    if (agentId) {
      payload.userId = parseInt(agentId);
    }

    const response = await fetch(`${this.config.baseUrl}/deals/${dealId}/notes`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`FUB API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }
}