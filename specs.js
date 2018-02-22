"use strict";

describe('Protractor Demo App User', function() {

    let headText = $$('h1').first();
    let dashboardLink = $$('a:link').first();
    let heroesLink = $$('a:link').last();
    let topHeroesTitle = $('h3');
    let setTopHeroes = element(by.className('grid grid-pad'));
    let topHeroElements = element.all(by.className('module hero'));
    let searchComponent = element(by.id('search-component'));
    let searchTitle = element(by.xpath('.//div[@id="search-component"]/h4'));
    let searchField = $('#search-box');
    let searchResult = $('.search-result');

    let backButton = element(by.buttonText('Back'));
    let saveButton = element(by.buttonText('Save'));
    let inputName = $('input');
    let heroTitle = element(by.tagName('h2'));
    let headerBar = element(by.className('header-bar'));
    let idLabel = element.all(by.tagName('label')).first();
    let nameLabel = element.all(by.tagName('label')).last();

    let myHeroesBlock = element(by.tagName('my-heroes'));
    let heroSet = element(by.className('heroes'));
    let addNewHeroButton = element(by.buttonText('Add New Hero'));
    let buttonNgFeatures = element(by.xpath('.//div/button'));
    let ngForTitle = element(by.tagName('h4'));
    let viewDetailsButton = element(by.buttonText('View Details'));
    let heroTitleDetail = element(by.xpath('.//div/h2'));
    let heroTable = element(by.tagName('tbody'));


    const URL = 'http://localhost:4200/dashboard';

    function getHeroByName(name) {
        return element(by.cssContainingText('.heroes li', name));
    }

    function getHeroDeleteButton(name){
       return getHeroByName(name).element(by.className('delete-button'));
    }

    async function verifyHeroesPageDisplayCorrectly(){
        await verifyHeaderDisplaysCorrectly();
        expect(await myHeroesBlock.isDisplayed()).toBe(true);
        expect(await heroSet.isDisplayed()).toBe(true);
        expect(await heroTitle.getText()).toEqual('My Heroes');
        expect(await addNewHeroButton.isDisplayed()).toBe(true);
        expect(await buttonNgFeatures.isDisplayed()).toBe(true);
        expect(await ngForTitle.getText()).toEqual('ngFor Features');
        
    }

    async function navigateToHeroesPage(){
        await heroesLink.click();
        await verifyHeroesPageDisplayCorrectly();
    } 

    async function navigateToDashboard(){
        await dashboardLink.click();
        await verifyDashboardDisplaysCorrectly();
    } 
  
    async function verifyHeaderDisplaysCorrectly(){
        expect(await headText.getText()).toEqual('Tour of Heroes');
        expect(await headerBar.isDisplayed()).toBe(true);
        expect(await dashboardLink.getText()).toEqual('Dashboard');
        expect(await heroesLink.getText()).toEqual('Heroes');
    }

    async function verifyDashboardDisplaysCorrectly(){
        await verifyHeaderDisplaysCorrectly();
        expect(await topHeroesTitle.getText()).toEqual('Top Heroes');
        expect(await setTopHeroes.isDisplayed()).toBe(true);
        expect(await topHeroElements.count()).toBe(4);
        expect(await searchComponent.isDisplayed()).toBe(true);
        expect(await searchTitle.getText()).toEqual('Hero Search');
        expect(await searchField.isDisplayed()).toBe(true);
    }

    async function verifyHeroDetailsDisplaysCorrectly(){
        await verifyHeaderDisplaysCorrectly();
        expect(await idLabel.isDisplayed()).toBe(true);
        expect(await nameLabel.isDisplayed()).toBe(true);
    
        expect(await idLabel.getText()).toContain('id');
        expect(await nameLabel.getText()).toContain('name');
    
        expect(await heroTitle.isDisplayed()).toBe(true);
        expect(await inputName.isDisplayed()).toBe(true);
        expect(await backButton.isDisplayed()).toBe(true);
        expect(await saveButton.isDisplayed()).toBe(true);
    
    }
    async function findHeroDetails(heroName) {
        expect(await searchField.isDisplayed()).toBe(true);
        await searchField.sendKeys('Narco');
        await searchResult.click();
        await verifyHeroDetailsDisplaysCorrectly();
    }

    async function changeHeroName(newHeroName){
        expect(await inputName.isDisplayed()).toBe(true);
        await inputName.clear();
        await inputName.sendKeys(newHeroName);
        let titleText = await heroTitle.getText();
        let inputText = await inputName.getText();
        expect(titleText).toContain(inputText);
    }

    async function typeHeroName(newHeroName){
        expect(await inputName.isDisplayed()).toBe(true);
        await inputName.clear();
        await inputName.sendKeys(newHeroName);
    }

    async function deleteHero(heroName){
        await navigateToHeroesPage();
        await getHeroDeleteButton(heroName).click();
    }

    beforeEach(async function() {
        await browser.get(URL);
    });

    it('should have a title', async function() {
        expect(await browser.getTitle()).toEqual('Blank');
    });

    it('should have all elements visible on the Dashboard and be correctly named', async function() {
       await verifyDashboardDisplaysCorrectly();
    });

    it('should be able to navigate to a hero details page and return back to the Dashboard', async function() {
        await findHeroDetails('Mr. Nice');
        await backButton.click();
        await verifyDashboardDisplaysCorrectly();
    });

    it('should be able to change hero name from the Dashboard', async function() {
        await findHeroDetails('Mr. Nice');
        await changeHeroName('Masha');
        await saveButton.click();
        await verifyDashboardDisplaysCorrectly();
        await navigateToHeroesPage();
        expect(await getHeroByName('Masha').isDisplayed()).toBe(true);
    });

    it('should be able to go to Heroes Page and have all elements visible and correctly named and go back to Dashboard', async function() {
        await navigateToHeroesPage();
        await navigateToDashboard();
    });
    
    it('should be able to delete a hero from Heroes Page', async function() {
        await navigateToHeroesPage();
        await getHeroDeleteButton('Dr IQ').click();
        expect(await getHeroByName('Dr IQ').isPresent()).toBe(false);
    });

    it('should be able to add a new hero from Heroes Page', async function() {
        await navigateToHeroesPage();
        await addNewHeroButton.click();
        await typeHeroName('ADEL');
        await saveButton.click();
        expect(await getHeroByName('ADEL').isDisplayed()).toBe(true);
    });

    it('should be able to view hero\'s detail from Heroes Page and navigate to Hero\'s Detail Page', async function() {
        await navigateToHeroesPage();
        await getHeroByName('Magneta').click();
        expect(await viewDetailsButton.isDisplayed()).toBe(true);
        expect(await heroTitleDetail.getText()).toContain('MAGNETA is my hero');

        await viewDetailsButton.click();
        await verifyHeroDetailsDisplaysCorrectly();
        expect(await heroTitleDetail.getText()).toContain('Magneta details!');
    });

    it('should be able to see hero\'s features on Heroes Page', async function() {
        await navigateToHeroesPage();
        await buttonNgFeatures.click();
        expect(await buttonNgFeatures.getText()).toBe('Hide ngFor Features');
        expect(await heroTable.isDisplayed()).toBe(true);

        await buttonNgFeatures.click();
        expect(await buttonNgFeatures.getText()).toBe('Show ngFor Features');
        expect(await heroTable.isDisplayed()).toBe(false);
    });

    it('should be able to view one of Top Heroes details', async function() {
        await topHeroElements.last().click();
        await verifyHeroDetailsDisplaysCorrectly();
    });
});