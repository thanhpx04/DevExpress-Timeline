import Resolver from '@forge/resolver';
import { fetch } from '@forge/api';

const resolver = new Resolver();

resolver.define('getText', (req) => {
    console.log(req);

    return 'Hello, world!';
});

resolver.define('getTeams', async ({ payload }) => {
    const response = await fetch('https://testpluginsteam.atlassian.net/rest/teams/1.0/teams/find', {
        body: JSON.stringify({
            "excludedIds": [],
            "maxResults": 10,
            "query": payload.title
        }), method: 'POST',
        headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            'Authorization': 'Basic ' + Buffer.from('thanhpx04@gmail.com:ATATT3xFfGF0ZA6mjZ6TdZ0GoxZ7XvStCoEPRuhWi8RLPEBJdeO0_eh2F3iVo-PPGdcS_z32KbOBx5dhx-h-UKG74R0mY80eUdfHFQJDbuy6UYJRdsS2nAierLMNTB8LDtrOdonn0x5c7H59fmTES7FFvUJLw2h4JalAgO_ZCd_8EG_b6tGx7jo=1986F57F').toString('base64')
        }
    });
    const data = await response.json();
    return data;
});

export const handler = resolver.getDefinitions();

