const { iterative_cml_runner_tpl } = require('./terraform');

describe('Terraform tests', () => {
  test('default options', async () => {
    const output = iterative_cml_runner_tpl({});
    expect(output).toMatchInlineSnapshot(`
      "

      terraform {
        required_providers {
          iterative = {
            source = \\"iterative/iterative\\"
          }
        }
      }

      provider \\"iterative\\" {}


      resource \\"iterative_cml_runner\\" \\"runner\\" {
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
      }
      "
    `);
  });

  test('basic settings', async () => {
    const output = iterative_cml_runner_tpl({
      repo: 'https://',
      token: 'abc',
      driver: 'gitlab',
      labels: 'mylabel',
      idle_timeout: 300,
      name: 'myrunner',
      single: true,
      cloud: 'aws',
      region: 'west',
      type: 'mymachinetype',
      gpu: 'mygputype',
      hdd_size: 50,
      ssh_private: 'myprivate',
      spot: true,
      spot_price: '0.0001'
    });
    expect(output).toMatchInlineSnapshot(`
      "

      terraform {
        required_providers {
          iterative = {
            source = \\"iterative/iterative\\"
          }
        }
      }

      provider \\"iterative\\" {}


      resource \\"iterative_cml_runner\\" \\"runner\\" {
        repo = \\"https://\\"
        token = \\"abc\\"
        driver = \\"gitlab\\"
        labels = \\"mylabel\\"
        idle_timeout = 300
        name = \\"myrunner\\"
        single = \\"true\\"
        cloud = \\"aws\\"
        region = \\"west\\"
        instance_type = \\"mymachinetype\\"
        instance_gpu = \\"mygputype\\"
        instance_hdd_size = 50
        ssh_private = \\"myprivate\\"
        spot = true
        spot_price = 0.0001
        
      }
      "
    `);
  });

  test('basic settings with runner forever', async () => {
    const output = iterative_cml_runner_tpl({
      repo: 'https://',
      token: 'abc',
      driver: 'gitlab',
      labels: 'mylabel',
      idle_timeout: 0,
      name: 'myrunner',
      single: true,
      cloud: 'aws',
      region: 'west',
      type: 'mymachinetype',
      gpu: 'mygputype',
      hdd_size: 50,
      ssh_private: 'myprivate',
      spot: true,
      spot_price: '0.0001'
    });
    expect(output).toMatchInlineSnapshot(`
      "

      terraform {
        required_providers {
          iterative = {
            source = \\"iterative/iterative\\"
          }
        }
      }

      provider \\"iterative\\" {}


      resource \\"iterative_cml_runner\\" \\"runner\\" {
        repo = \\"https://\\"
        token = \\"abc\\"
        driver = \\"gitlab\\"
        labels = \\"mylabel\\"
        idle_timeout = 0
        name = \\"myrunner\\"
        single = \\"true\\"
        cloud = \\"aws\\"
        region = \\"west\\"
        instance_type = \\"mymachinetype\\"
        instance_gpu = \\"mygputype\\"
        instance_hdd_size = 50
        ssh_private = \\"myprivate\\"
        spot = true
        spot_price = 0.0001
        
      }
      "
    `);
  });

  test('Startup script', async () => {
    const output = iterative_cml_runner_tpl({
      repo: 'https://',
      token: 'abc',
      driver: 'gitlab',
      labels: 'mylabel',
      idle_timeout: 300,
      name: 'myrunner',
      single: true,
      cloud: 'aws',
      region: 'west',
      type: 'mymachinetype',
      gpu: 'mygputype',
      hdd_size: 50,
      ssh_private: 'myprivate',
      spot: true,
      spot_price: '0.0001',
      startup_script: 'c3VkbyBlY2hvICdoZWxsbyB3b3JsZCcgPj4gL3Vzci9oZWxsby50eHQ='
    });
    expect(output).toMatchInlineSnapshot(`
      "

      terraform {
        required_providers {
          iterative = {
            source = \\"iterative/iterative\\"
          }
        }
      }

      provider \\"iterative\\" {}


      resource \\"iterative_cml_runner\\" \\"runner\\" {
        repo = \\"https://\\"
        token = \\"abc\\"
        driver = \\"gitlab\\"
        labels = \\"mylabel\\"
        idle_timeout = 300
        name = \\"myrunner\\"
        single = \\"true\\"
        cloud = \\"aws\\"
        region = \\"west\\"
        instance_type = \\"mymachinetype\\"
        instance_gpu = \\"mygputype\\"
        instance_hdd_size = 50
        ssh_private = \\"myprivate\\"
        spot = true
        spot_price = 0.0001
        startup_script = \\"c3VkbyBlY2hvICdoZWxsbyB3b3JsZCcgPj4gL3Vzci9oZWxsby50eHQ=\\"
      }
      "
    `);
  });
});
